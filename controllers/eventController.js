
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var axios =require('axios');
var message = require('../models/message');


const getItems = function(req, res, slug){
    var params= req.query;
    const api = axios.create({baseURL: "https://app.ticketmaster.com/discovery/v2/",responseType: 'json'});
    params['apikey']=secrets.ticket_master_api_key;
    
    
    api.get(slug,{ params }).then((res2)=>{
      if (res2.data){
        var output=[]
        var events;
        if (res2.data._embedded && res2.data._embedded.events){
            events=res2.data._embedded.events;
        } else{
            events=[res2.data];
            
        }
        for (var event of events){
            var myevent={};
            myevent['id']=event.id;
            myevent['datetime']=event.dates.start.localDate +" "+event.dates.start.localTime 
            myevent['description']=event.name
            myevent['link']=event.url
            myevent['image']=event.images ? event.images[0].url : "";
            myevent['category']=event.classifications? event.classifications[0].genre.name: "";
            myevent['venue']={}
            if (event._embedded.venues){
                var venue=event._embedded.venues[0]
                var myvenue = myevent.venue
                myvenue['name']=venue.name
                myvenue['location']=venue.location
                myvenue['id']=venue.id
                //myvenue['rating']= get from database
            }
            
            output.push(myevent)
        }

        res.status(200).send(message.response("Ok", output));

        }
        
      }
    )  

}

const getEventList = function(req, res) {
    const slug='events.json'
    getItems(req,res,slug)
    

}

const getEvent = function(req, res) {
    const id = req.params.id
    const slug='events/'.concat(id).concat('.json')
    getItems(req,res,slug)

}




exports.getEventList = getEventList;
exports.getEvent = getEvent;