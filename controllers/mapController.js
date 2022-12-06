
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var axios =require('axios');
var message = require('../models/message');


const getItems = async function(req, res, slug){
    var params= req.query;
    const api = axios.create({baseURL: "https://app.ticketmaster.com/discovery/v2/",responseType: 'json'});
    params['apikey']=secrets.ticket_master_api_key;
    
    const res2 = await api.get(slug,{ params })
    
    if (res2.data){
        var output=[]
        var venues;
        if (res2.data._embedded && res2.data._embedded.venues){
            venues=res2.data._embedded.venues;
        } else{
            venues=[res2.data];
        }
        for (var venue of venues){
            var map_item={};
            map_item['location']=venue.location
            if (venue.upcomingEvents._total==1){
                map_item['type']='event'
                var events=await getVenueEvents(venue.id)
                map_item['id']=events[0].id
                map_item['name']=events[0].name
                await rate_limit_helper()
                output.push(map_item)
            } 
            else if (venue.upcomingEvents._total>=1){
                map_item['type']='venue'
                map_item['id']=venue.id
                map_item['name']=venue.name
                output.push(map_item)
            }
            
        }
        res.status(200).send(message.response("Ok", output));

    }


}

const getVenueEvents = async function(venu_id) {
    var params={}
    const api = axios.create({baseURL: "https://app.ticketmaster.com/discovery/v2/",responseType: 'json'});
    const slug='events.json'
    params['apikey']=secrets.ticket_master_api_key;
    params['venueId']=venu_id

    const res = await api.get(slug,{ params })
  
    var myevents=[]
    if (res.data){
        var events=res.data._embedded.events
        for (var event of events){
            myevents.push({"id":event.id,"name":event.name})
        }
    }
    return myevents;
}



const rate_limit_helper = () =>
  new Promise(resolve =>
    setTimeout(() => resolve(), 80)
  );

const getMap = function(req, res) {
    const slug='venues.json'
    getItems(req,res,slug)
}





exports.getMap = getMap;