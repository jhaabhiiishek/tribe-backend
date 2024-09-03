const { use } = require('passport')
const authenticate = require('../../auth/authentication')

const project = require('../../modules/project')
const student = require('../../modules/student')
const tribe = require('../../modules/tribe')

const express = require('express')
const app = express()

app.post('/addproject',authenticate, async(req,res)=>{
	try{
		const {
			user_id,
			project_name,
			project_type,
			description,
			project_link
		}=req.body;
		if(!(user_id&&project_name&&project_type&&project_link&&description)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		let project_for_user = 0;
		let val=0;
		const projs = await project.find({
			user_id:user_id
		}).sort({user_project_id : -1}).limit(1)
		if(projs[0]!=null&&projs[0]!=undefined&&projs[0]!=NaN){
			val = projs[0].user_project_id;
		}
		if(val==null||val ==undefined||val==NaN){
			val = 0;
		}
		project_for_user = val+1;

		const project_entry = await project.create({
			description:description,
			user_id:user_id,
			user_project_id:project_for_user,
			upvotes : 0,
			project_name : project_name,
			project_type:project_type,
			project_link:project_link,
			upload_date:new Date()
		})
		if(project_entry){
			res.status(201).json({
				success:1,
				msg:'success',
				data:{
					project_entry
				}
			})
		}else{
			res.status(203).json({
				success:0,
				msg:'failed',
				data:{
					project_entry
				}
			})
		}
	}catch(err){
		res.status(203).json({
			success:0,
			msg:'Failed',
			message:err
		})
	}
})

app.post('/deleteproject',authenticate, async(req,res)=>{
	
	try{
		const {
			user_id,
			project_name
		}=req.body;
		if(!(user_id&&project_name)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		const project_entry = await project.findOne({
			user_id:user_id,
			user_project_id:project_for_user
		})
		if(project_entry){
			const delete_project = await project.findOneAndDelete({
				user_id:user_id,
				user_project_id:project_for_user
			})
			if(delete_project){
				res.status(201).json({
					success:1,
					msg:'success',
					data:{
						project_entry
					}
				})
			}else{
				res.status(203).json({
					success:0,
					msg:"Cant delete the project"
				})
			}
		}else{
			res.status(203).json({
				status:'failed',
				msg:"Cant find the project"
			})
		}
	}catch(err){
		res.status(203).json({
			success:0,
			message:err
		})
	}
})

app.post('/fetchprojects',authenticate, async(req,res)=>{
	try{
		const {
			user_id
		}=req.body;

		if(!(user_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter user_id"
			})
		}

		const user = await student.findOne({
			user_id:user_id
		})
		
		if(!user){
			res.status(203).json({
				success:0,
				msg:"Cant find the user"
			})
		}else{
			if(user.links[0]==null||user.links[0]==undefined){
				res.status(203).json({
					success:0,
					msg:"Make links to explore their projects"
				})
			}else{
				let length = user.links.length;
				let collection_array =[]
				for(let i=0;i<length;i++){
					const link_projects = await project.find({
						user_id: user.links[i]
					})

					collection_array.push(link_projects)					
				}
				let final_array = collection_array.flat()
				res.status(201).json({
					success:1,
					msg:'Done',
					data: final_array
				})
			}
		}
	}catch(err){
		res.status(203).json({
			success:0,
			msg:err
		})
	}
})

app.post('/fetchtribeprojects',authenticate, async(req,res)=>{
	try{
		const {
			user_id,
			tribe_id
		}=req.body;

		if(!(user_id&&tribe_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter user_id & tribe_id"
			})
		}

		const user = await student.findOne({
			user_id:user_id,
			tribes:tribe_id
		})

		const tribe_search = await tribe.findOne({
			tribe_id:tribe_id,
			members:user_id
		})

		
		if((user!=null&&tribe_search!=null)){
			res.status(203).json({
				success:0,
				msg:"Cant find the user for this tribe"
			})
		}else{
			if(tribe_search.members[1]==null||tribe_search.members[1]==undefined){
				res.status(203).json({
					success:0,
					msg:"Tribe doesnt have enough people"
				})
			}else{
				let length =tribe_search.members.length;
				let collection_array =[]
				for(let i=0;i<length;i++){
					let link_projects = []
					if(tribe_search.members[i]!=user_id){
						link_projects = await project.find({
							user_id: tribe_search.members[i]
						})
					}
					collection_array.push(link_projects)					
				}
				let final_array = collection_array.flat()
				res.status(201).json({
					success:0,
					msg:'Done',
					data: final_array
				})
			}
		}
	}catch(err){
		res.status(203).json({
			success:0,
			msg:'Failed',
			message:err
		})
	}
})

app.post('/likeprojects',authenticate, async(req,res)=>{

	try{
		const {
			user_id,
			project_user_id,
			user_project_id
		}=req.body;

		if(!(user_id&& project_user_id&&user_project_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the fields"
			})
		}

		const liked_check = await project.findOne({
			user_id:project_user_id,
			user_project_id:user_project_id,
			upvoted_by:user_id
		})

		if(liked_check!=null||liked_check!=undefined||liked_check!=NaN){
			const project_like = await project.findOneAndUpdate({
				user_id:project_user_id,
				user_project_id:user_project_id
			},{
				$inc:{
					upvotes:-1
				},
				$pull:{
					upvoted_by:user_id
				}
			})
		}
		else{
			const project_like = await project.findOneAndUpdate({
			user_id:project_user_id,
			user_project_id:user_project_id
		},{
			$inc:{
				upvotes:1
			},
			$push:{
				upvoted_by:user_id
			}
		})}
		
		if(!project_like){
			res.status(203).json({
				success:0,
				msg:"Cant update likes"
			})
		}else{
			res.status(201).json({
				success:1,
				msg:'Liked'
			})
		}
	}catch(err){
		res.status(203).json({
			success:0,
			msg:'Failed',
			message:err
		})
	}
})

module.exports= app