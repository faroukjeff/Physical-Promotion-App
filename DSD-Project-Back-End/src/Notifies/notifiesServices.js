const methods = {};
const Notifies = require(__dirname + "/../../models/notifies");
const cf = require('../../src/Forms/formServices');


methods.add = (studyId, title, text) => {
	return new Promise((resolve, reject) => {
		if(studyId ==="ALL"){
			cf.getAllClientsId().then((users)=>{
				for(const user in users){
					let notifies = new Notifies({
						title: title,
						text: text,
						studyId: users[user],
						time: new Date()
					  })
						notifies.save().then((res) => {
							  resolve(res);
						  })
						  .catch((err) => {
							  console.log(err);
							  reject({
								  code: 500,
								  message: "There was a problem with finding user: ServerError",
							  });
						  });
				}

			})
		}else{
			const users = studyId.split(",")
			for(const user in users){
				let notifies = new Notifies({
					title: title,
					text: text,
					studyId: users[user],
					time: new Date()
				  })
					notifies.save().then((res) => {
						  resolve(res);
					  })
					  .catch((err) => {
						  console.log(err);
						  reject({
							  code: 500,
							  message: "There was a problem with finding user: ServerError",
						  });
					  });
			}
	}
	});
	
};

methods.get = (studyId) => {
	return new Promise(async (resolve, reject) => {
    let notifies = await Notifies.find({studyId: studyId}).sort({time: 'desc'}).exec();
		resolve(notifies);
	});
};

methods.clear = (studyId) => {
	return new Promise(async (resolve, reject) => {
    let notifiesclear = await Notifies.find({studyId: studyId}).deleteMany().exec();
		resolve(notifiesclear);
	});
};

module.exports = methods;
