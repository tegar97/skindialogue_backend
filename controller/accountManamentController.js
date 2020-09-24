const User = require('./../models/userModels')


exports.index = async(req,res) =>{
    
    const user = await User.find()
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')
    const alert = {message: alertMessage,status: alertStatus}

    res.status(200).render('admin/user/index',{
        title : 'User Management',
        alert,
        user
  
        
        
    })
    
}

exports.changeRole = async(req,res) =>{
    try {
    
        const { id,role } = req.body;
        console.log(role)
  
        const user = await User.findOne({_id: id})
        user.role = role
        await user.save()
        req.flash('alertMessage','sukses update role user ')
        req.flash('alertStatus','success')
        res.redirect('/user')
    } catch (error) {
        req.flash('alertMessage',`${error.message} `)
        req.flash('alertStatus','danger')
        res.redirect('/user')
    }
}

exports.deleteUser = async(req,res) =>{

    try {
        const user = await User.findByIdAndDelete({_id : req.params.id})
        if(user.role === 'admin') {
            req.flash('alertMessage',`TIDAK BISA MENGHAPUS AKUN ADMIN !! `)
            req.flash('alertStatus','danger')
            res.redirect('/user')
        }
        req.flash('alertMessage','sukses delete user')
        req.flash('alertStatus','success')
        res.redirect('/user')
    } catch (error) {
        req.flash('alertMessage',`${error.message} `)
        req.flash('alertStatus','danger')
        res.redirect('/user')
    }
  
}
