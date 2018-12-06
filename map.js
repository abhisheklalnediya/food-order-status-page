var map;
var icon_resturant = 'http://maps.google.com/mapfiles/kml/pal2/icon63.png'
var icon_home = 'http://maps.google.com/mapfiles/kml/pal3/icon31.png'
var icon_agent = ['/delivery0.png', '/delivery1.png', '/delivery2.png', '/delivery3.png']
var marker = []
function initMap() {
  var animation= google.maps.Animation.DROP
  var route = [
    {position: {lat:12.925239, lng: 77.637407}, agent_icon:0},
    {position: {lat:12.925239, lng: 77.637407}, agent_icon:2, message: 'Order recieved, waitng for returant conformation.'},
    {position: {lat:12.925239, lng: 77.637407}, agent_icon:1, icon: icon_agent, agent: true, message: 'Agent Ram(+91-1224-441-555) is assiged, he is heading to the resturant'},
    {position: {lat:12.927342, lng: 77.637703}, agent_icon:1, message: 'Resturant conformed your order!'},
    {position: {lat:12.927342, lng: 77.637703}, agent_icon:1},
    {position: {lat:12.927540, lng: 77.637498}, agent_icon:0, icon: icon_resturant, title: 'Mani\'s Dum Biryani', resturant: true, message: 'Ram reached the resturant and your order is being prepared!'},
    {position: {lat:12.927169, lng: 77.637155}, agent_icon:0, message: "Food is in route."},
    {position: {lat:12.926907, lng: 77.636704}, agent_icon:0},
    {position: {lat:12.926087, lng: 77.636629}, agent_icon:3},
    {position: {lat:12.925775, lng: 77.634624}, agent_icon:0},
    {position: {lat:12.927082, lng: 77.634453}, agent_icon:1},
    {position: {lat:12.926936, lng: 77.633847}, agent_icon:0},
    {position: {lat:12.926889, lng: 77.633396}, agent_icon:0},
    {position: {lat:12.925018, lng: 77.633561}, agent_icon:3, message: 'Your order is around the corner!'},
    {position: {lat:12.9250503,lng: 77.6332317}, agent_icon:0, icon: icon_home, title: 'ZestMoney' , animation, home: true, message:"Your order is delieverd!"},
  ]
  
  var resturant = route.find(x=>x.resturant)
  var home = route.find(x=>x.home)
  var agent = route.find(x=>x.agent)
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 12.9265356, lng: 77.635808},
    zoom: 17,
    
  });
  
  
  const marker_resturant = new google.maps.Marker({
    ...resturant, map
  });

  const marker_home = new google.maps.Marker({
    ...home, map
  });

  const agent_marker = new google.maps.Marker({
    ...agent, map
  });

  const trippoints = [];
  
  function translate( pos1, pos2 ) {
    var {message, agent_icon} = pos2
    var lt = pos1.position.lat,
    ln = pos1.position.lng,
    dx = lt - pos2.position.lat,
    dy = ln - pos2.position.lng,
    i = 1,
    count = 20;
    center = true;
    while( i < count ) {
      i += 1;
      lat = ( lt - ( dx * i / count ));
      lng = ( ln - ( dy * i / count ));
      var pos = new google.maps.LatLng(lat, lng);
      trippoints.push({pos, message, center, agent_icon})
      message = null;
      center = false;
    }
  }
  
  route.reduce((c,r) => {
    if(c) translate(c, r)
    return r
  })
  trippoints.reverse()
  
  function travel() {
    var point = trippoints.pop();
    agent_marker.setPosition(point.pos);
    agent_marker.setIcon(icon_agent[point.agent_icon]);
    if(point.message){
      appentStatus(point.message)
    }
    // if(point.center){
    //   map.setCenter(point.pos)
    // };
    if(trippoints.length) setTimeout( travel, 100 );
  }
  travel()

  function appentStatus(message) {
    var div = document.createElement('div');
    var status = `<h3>${new Date().toLocaleTimeString()}: ${message}</h3>`;
    div.innerHTML = status;
    document.getElementById("status").appendChild(div);
  }
}