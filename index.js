const express = require('express')
const bodyparser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
app.use(bodyparser({urlencoded:true}))

const user_data = require('./models/users_data')
const reserve_data = require('./models/reserve_data')
const hotel_data = require('./models/hotel_data')

mongoose.connect("mongodb+srv://db:db123@cluster0.43zli.mongodb.net/hotel?retryWrites=true&w=majority", {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
.then(() => {
  console.log('MongoDB Connected')
})
.catch(err => console.log(err))


var publicDir = require('path').join(__dirname,'/public')
app.use(express.static(publicDir))


app.set('views','views')
app.set('view engine','ejs')


app.get('/view',(req,res)=>{
    res.render('edit')
})

app.get('/reserve',(req,res)=>{
    
  reserve_data.findOne({email:global_email},function(err,founduser){
    if(err){
       // res.send(err);
        console.log(err)
    }
    else{

        if(founduser)
        {
            console.log("already")
            console.log(founduser)
            res.render('details',{candidateList:founduser})
        }

        else
        {
          res.render('reserve')
        }

      } 
      
})
 
})

app.get('/thanks',(req,res)=>{

    reserve_data.findOne({email:global_email},function(err,founduser){
        if(err){
            res.send(err);
        }
        else{
            if(founduser)
            {   
                console.log("candidate data wait");
                console.log(founduser);
                res.render("thanks",{candidateList:founduser});
            }
        }
   })
})

app.post('/reserve',(req,res)=>{ 
  const first = req.body.first;
  const last = req.body.last;
  const contact = req.body.contact;
  const email = req.body.email;
  const adults = req.body.adults;
  const children = req.body.children;
  const arrival = req.body.arrival;
  const departure = req.body.departure;
  const room = req.body.room;

  reserve_data.findOne({email:global_email},function(err,founduser){
      if(err){
         // res.send(err);
          console.log(err)
      }
      else{

          if(founduser)
          {
              console.log("already")
              console.log(founduser)
              res.render('details')
          }

          else
          {
            console.log(founduser);
            console.log(room)
            console.log("thank you for new accout")

            const newUser = reserve_data({
                  first,
                  last,
                  contact,
                  email,
                  room,
                  adults,
                  children,
                  arrival,
                  departure
              });
      
            newUser.save(()=>{
                console.log('done')
                console.log(newUser)


                hotel_data.findOne({room:room},function(err,founduser){
                    if(err){
                        res.send(err);
                    }
                    
                    else{
                        console.log("room");
                        console.log(founduser)
                        if(founduser)
                        {   
                            /*otpp.deleteOne({otp:otppr}, function (err, result) {
                                if (err) {
                                    console.log("error query");
                                } else {
                                      console.log("otp deleted");
                                }
                            });
            
                            res.redirect('/vote')*/
                            console.log(founduser.availability)
                            console.log("found room");


                            if(founduser.availability>0)
                            {
                                
                                hotel_data.findOneAndUpdate({room:room},{$inc: {availability:-1}},function(err,founduser){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('availability changed')
                                    }
                                })

                                reserve_data.findOne({email:global_email},function(err,founduser){
                                            if(err){
                                                res.send(err);
                                            }
                                            else{
                                                if(founduser)
                                                {   
                                                    console.log("candidate data wait");
                                                    console.log(founduser);
                                                    res.render("thanks",{candidateList:founduser});
                                                }
                                                else{
                                                  res.render('reserve')
                                                }
                                            }
                                    })
                            }
                            
                            else
                            {}
                        }
            
                        else
                        {
                            console.log("in room notfound");
                        }
                    }
               })


            });

          }

        } 
        
 })

})

app.get('/hotel',(req,res)=>{
  res.render('hotel')
})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.get('/admin',(req,res)=>{
    res.render('admin')
})

app.post('/signup',(req,res)=>{
    const name = req.body.name;
    const password = req.body.password;
    const password2 = req.body.cpassword;
    const email = req.body.email;
    const contact = req.body.phone;

    console.log("in signup")

    user_data.findOne({email:email},function(err,founduser){
        if(err){
            res.send(err);
            console.log(err)
        }else{
            if(founduser)
            {   
                console.log("bro already done")
                console.log(founduser);
                res.redirect('/login')
            }

            else
            {
                if(password===password2)
                {
                    console.log(founduser);
                    console.log("thank you for new accout")

                    const newUser = user_data({
                        name,
                        email,
                        contact,
                        password, 
                    });
             
                    newUser.save(()=>{
                     console.log('done');
                     console.log(newUser)
                     res.redirect('/login')
                 });

                }
                
            }
        }
   })

})

app.get('/delete',(req,res)=>{
  

    reserve_data.findOne({email:global_email},function(err,founduser){
      if(err){
          res.send(err);
      }
      else{
  
        if(founduser)
        {   
            console.log("candidate data wait");
            console.log(founduser);
            res.render('delete')
        }
    else
        {
          res.render('reserve')
        }
          
      }
  })
    
})


app.post('/delete',(req,res)=>{

    reserve_data.findOne({email:global_email},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            
            if(founduser)
            {   
                console.log("delete:")
                console.log(founduser)
                //party=founduser["party"];
                reserve_data.deleteOne({email:global_email}, function (err, result) {
                    if (err) {
                        console.log("error query");
                    } else {
                          console.log(result);
                          res.redirect("/")
                    }
                });
            }

            else
            {
              res.render("home")
            }
            
        }
   })

  
    
})

app.get('/login',(req,res)=>{
    res.render('login')
})

var global_email;

app.get('/edit',(req,res)=>{

  reserve_data.findOne({email:global_email},function(err,founduser){
    if(err){
        res.send(err);
    }
    else{

      if(founduser)
      {   
          console.log("candidate data wait");
          console.log(founduser);
          res.render('edit')
      }
  else
      {

        res.render('reserve')
      }
        
    }
})
    
})

app.post("/edit", (req, res) => {
    const contact = req.body.contact;
    const adults = req.body.adults;
    const children = req.body.children;
    const room = req.body.room;
    const arrival = req.body.arrival;
    const departure = req.body.departure;

    console.log("data assas");

    reserve_data.findOne({email:global_email},function(err,founduser){
      if(err){
          res.send(err);
      }
      else{
          if(founduser)
          {   
            if(founduser)
            {   
              if (contact) {
                reserve_data.findOneAndUpdate(
                { email: global_email },
                { $set: { contact: contact } },
                function (err, abc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("data for contact");
                    console.log(abc);
                    //res.render("login");
                  }
                }
              );
            }
            if (children) {
                reserve_data.findOneAndUpdate(
                { email: global_email },
                { $set: { children: children } },
                function (err, abc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("data children");
                    //res.render("login");
                  }
                }
              );
            }
          
            if (adults) {
                reserve_data.findOneAndUpdate(
                { email: global_email },
                { $set: { adults: adults } },
                function (err, abc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(abc);
                    //res.render("login");
                  }
                }
              );
            }
            if (room) {
                reserve_data.findOneAndUpdate(
                { email: global_email },
                { $set: { room: room } },
                function (err, abc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(abc);
                    // res.render("login");
                  }
                }
              );
            }
        
            if (arrival) {
                reserve_data.findOneAndUpdate(
                { email: global_email },
                { $set: { arrival: arrival } },
                function (err, abc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(abc);
                    //res.render("login");
                  }
                }
              );
            }
        
            if (departure) {
                reserve_data.findOneAndUpdate(
                  { email: global_email },
                  { $set: { departure: departure } },
                  function (err, abc) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(abc);
                      //res.render("login");
                    }
                  }
                );
              }
            res.render("login");
            }

          }

          else
          {
            res.render('reserve')
          }
      }
 })

   
  });

app.get('/details',(req,res)=>{

    reserve_data.findOne({email:global_email},function(err,founduser){
        if(err){
            res.send(err);
        }
        else{

          if(founduser)
          {   
              console.log("candidate data wait");
              console.log(founduser);
              res.render("details",{candidateList:founduser});
          }
      else
          {
            res.render('reserve')
          }
            
        }
   })
    //res.render('details')
})

app.post('/login',(req,res)=>{

  const email = req.body.email;
  const password1 = req.body.password;
  console.log(email)
  console.log(password1)
  user_data.findOne({email:email,password:password1},function(err,founduser){
      if(err){
          console.log(err);
      }
      else{

        if(founduser==null)
        {
          res.render('signup')
        }
          
       else if(founduser!=[])
          {   
              
              console.log("found user");
              global_email=email;
              console.log(founduser);
                res.render('welcome')       
          }

          else{
            res.render('signup')
          }
      }
 })
  
})

app.get('/',(req,res)=>{
    res.render('home')
})
/*
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port);
*/
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('Example app listening on port 8000!')
});