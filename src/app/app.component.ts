
import { ChartOptions, ChartType,ChartDataSets} from 'chart.js';
import { SingleDataSet,monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Label } from 'ng2-charts';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var H: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'report-generation';

   
  @ViewChild("map", { static: true }) public mapElement: ElementRef;  
  
  public lat: any = '19.0760';  
  public lng: any = '72.8777';  
  routeColor="red";
    mapContainer;
  routeInstructionsContainer;
  bubble;
  private platform: any;  
  private map: any;  
   
 
  private _appCode: string = 'Aq_0h-AzS3H2y0OWTGJs5QV4A4hF8x6gAjePg-UfzIo';  
  
  public constructor() {  
    
  }  
  
  public ngOnInit() {  
    
     
  }  
  public ngAfterViewInit() {
    this.platform = new H.service.Platform({
      'app_code':this._appCode,
     

      });  
      this.initialiseMap(this.map,this.lat,this.lng);
     // this.addMarkersToMap();
      
  }
  initialiseMap(_eleName,_lat, _lng){
  
        let  defaultLayers = this.platform.createDefaultLayers();
         this.map = new H.Map(
            this.mapElement.nativeElement,
            defaultLayers.normal.map,
            {
              zoom: 11,
              center: { lat: _lat, lng: _lng },
              pixelRatio: window.devicePixelRatio || 1
            });

            window.addEventListener('resize', () => this.map.getViewPort().resize());
            var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
            // Create the default UI components
           var  ui = H.ui.UI.createDefault(this.map, defaultLayers);
           var  coords = {lat:19.1124022, lng:72.9181476};
           var marker = new H.map.Marker(coords);
          
           marker.setData("<p>" + 'panvel' + "<br>" + "</p>");  
           marker.addEventListener('tap', event => {  
             let bubble = new H.ui.InfoBubble(event.target.getPosition(), {  
               content: event.target.getData()  
             });  
             ui.addBubble(bubble);  
           }, false);
           this.map.addObject(marker);
           let marker1=new H.map.Marker({lat:19.0751,lng:72.9091});
           this.map.addObject(marker1);
           let marker2=new H.map.Marker({lat:19.1179,lng:72.8631});
           this.map.addObject(marker2);
          // this.calculateRouteFromAtoB(this.platform,marker1,marker2,'car','red');
           var waypoints = [
            '19.1124022,72.9181476',
            
          ];
          
          }
         

 route()
 {
  this.calculateRouteFromAtoBWithwaypoints(); 
 }

 
 /**
  * Calculates and displays a car route from the original 
  * to the destination.
  *
  *
  * @param {H.service.Platform} platform 
  * A stub class to access HERE services
  * @param string _original
  * A original (from) location co-ordinates like 18.983664,73,77749
  * @param string _destination
  * A destination (to) location co-ordinates like 18.983664,73,77749
  * @param string _transaportMode like 'car'
  * @param string _routeColor - A route polyline color
  */
  calculateRouteFromAtoB(platform, _original, _destination, _transaportMode, _routeColor) {
     var router = platform.getRoutingService(null, 8),
         routeRequestParams = {
           routingMode: 'fast',
           transportMode: _transaportMode,
           origin: _original, // from location
           destination: _destination, // to Location
           return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
         };
   
         this.routeColor=_routeColor;
 
     router.calculateRoute( routeRequestParams,data => {
      if(data.response) {
       var  route = data.response.route[0];
         route.sections.forEach((section) => {
           // decode LineString from the flexible polyline
           let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
       
           // Create a polyline to display the route:
           let polyline = new H.map.Polyline(linestring, {
             style: {
               lineWidth: 4,
               strokeColor: _routeColor
             }
           });
       
           // Add the polyline to the map
           this.map.addObject(polyline);
           // And zoom to its bounding rectangle
          this. map.getViewModel().setLookAtData({
             bounds: polyline.getBoundingBox()
           });
          });
       }
      },
       error => {
        console.error(error);
    });
  }
  
   
  
     /**
 * Calculates and displays a car route from the original 
 * to the destination.
 *
 *
 * @param {H.service.Platform} platform 
 * A stub class to access HERE services
 * @param string _original
 * A original (from) location co-ordinates like 18.983664,73,77749
 * @param string _destination
 * A destination (to) location co-ordinates like 18.983664,73,77749
 * @param string _transaportMode like 'car'
 * @param string _routeColor - A route polyline color
 * @param string _waypoints - In between waypoints.
 */
  calculateRouteFromAtoBWithwaypoints() {
    var router = this.platform.getRoutingService(null, 8),
        routeRequestParams = {
          'routingMode': 'fast',
          'transportMode':'car',
          origin: '19.1124022,72.9181476', // from location
          destination:'19.1179,72.8631',// to Location
          'via':'19.1124022,72.9181476',
          'return': 'polyline'
        };
  
        this.routeColor='red';
        router.calculateRoute(routeRequestParams,(result)=>{
      if(result.statusCode==200) {
        var route = result.route[0];
        route.sections.forEach((section) => {
          // decode LineString from the flexible polyline
          let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
      
          // Create a polyline to display the route:
          let polyline = new H.map.Polyline(linestring, {
            style: {
              lineWidth: 4,
              strokeColor:'red'
            }
          });
          this.addRouteShapeToMap(route);
          this.addManueversToMap(route);
          this.addWaypointsToPanel(route);
          this.addManueversToPanel(route);
         this.addSummaryToPanel(route);
          // Add the polyline to the map
          this.map.addObject(polyline);
          // And zoom to its bounding rectangle
          this.map.getViewModel().setLookAtData({
            bounds: polyline.getBoundingBox()
          });
        })
      }
      },
      (error)=>
     {
        console.log(error.error);
        
      }
      
    );
  }

  
    // });



 /**
* This function will be called once the Routing REST API provides a response
* @param {Object} result A JSONP object representing the calculated route
*
*/
onSuccess(result) {
   var route = result.routes[0];
 
   /*
    * The styling of the route response on the map is entirely under the developer's control.
    * A representative styling can be found the full JS + HTML code of this example
    * in the functions below:
    */
   this.addRouteShapeToMap(route);
   this.addManueversToMap(route);
   this.addWaypointsToPanel(route);
   this.addManueversToPanel(route);
  this.addSummaryToPanel(route);
 }

 /**
* This function will be called if a communication error occurs during the JSON-P request
* @param {Object} error The error message received.
*/
onError(error) {
   alert('Can\'t reach the remote server');
 }

 
 // Hold a reference to any infobubble opened

/**
* Opens/Closes a infobubble
* @param {H.geo.Point} position The location on the map.
* @param {String} text          The contents of the infobubble.
*/
 openBubble(position, text) {
   if (!this.bubble) {
     this.bubble = new H.ui.InfoBubble(
       position,
       // The FO property holds the province name.
       {content: text});
     H.ui.addBubble(this.bubble);
   } else {
     this.bubble.setPosition(position);
     this.bubble.setContent(text);
     this.bubble.open();
   }
 }

 /**
* Creates a H.map.Polyline from the shape of the route and adds it to the map.
* @param {Object} route A route as received from the H.service.RoutingService
*/
addRouteShapeToMap(route) {
   route.sections.forEach((section) => {
     // decode LineString from the flexible polyline
     let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
 
     // Create a polyline to display the route:
     let polyline = new H.map.Polyline(linestring, {
       style: {
         lineWidth: 4,
         strokeColor: this.routeColor
       }
     });
 
     // Add the polyline to the map
     this.map.addObject(polyline);
     // And zoom to its bounding rectangle
     this.map.getViewModel().setLookAtData({
       bounds: polyline.getBoundingBox()
     });
   });
 }

 /**
* Creates a series of H.map.Marker points from the route and adds them to the map.
* @param {Object} route A route as received from the H.service.RoutingService
*/
 addManueversToMap(route) {
   var svgMarkup = '<svg width="18" height="18" ' +
     'xmlns="http://www.w3.org/2000/svg">' +
     '<circle cx="8" cy="8" r="8" ' +
       'fill="#1b468d" stroke="white" stroke-width="1" />' +
     '</svg>',
     dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
     group = new H.map.Group(),
     i,
     j;
 
   route.sections.forEach((section) => {
     let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();
 
     let actions = section.actions;
     // Add a marker for each maneuver
     for (i = 0; i < actions.length; i += 1) {
       let action = actions[i];
       var marker = new H.map.Marker({
         lat: poly[action.offset * 3],
         lng: poly[action.offset * 3 + 1]},
         {icon: dotIcon});
       marker.instruction = action.instruction;
       group.addObject(marker);
     }
 
     group.addEventListener('tap', function (evt) {
       this.map.setCenter(evt.target.getGeometry());
       this.openBubble(evt.target.getGeometry(), evt.target.instruction);
     }, false);
 
     // Add the maneuvers group to the map
     this.map.addObject(group);
   });
 }
 
 /**
  * Creates a series of H.map.Marker points from the route and adds them to the map.
  * @param {Object} route A route as received from the H.service.RoutingService
  */
   addWaypointsToPanel(route) {
   var nodeH3 = document.createElement('h3'),
     labels = [];
 
   route.sections.forEach((section) => {
     labels.push(
       section.turnByTurnActions[0].nextRoad.name[0].value)
     labels.push(
       section.turnByTurnActions[section.turnByTurnActions.length - 1].currentRoad.name[0].value)
   });
 
   nodeH3.textContent = labels.join(' - ');
   this.routeInstructionsContainer.innerHTML = '';
   this.routeInstructionsContainer.appendChild(nodeH3);
 }
 
 /**
  * Creates a series of H.map.Marker points from the route and adds them to the map.
  * @param {Object} route A route as received from the H.service.RoutingService
  */
  addSummaryToPanel(route) {
   let duration = 0,
     distance = 0;
 
   route.sections.forEach((section) => {
     distance += section.travelSummary.length;
     duration += section.travelSummary.duration;
   });
 
   var summaryDiv = document.createElement('div'),
     content = '<b>Total distance</b>: ' + distance + 'm. <br />' +
       '<b>Travel Time</b>: ' + this.toMMSS(duration) + ' (in current traffic)';
 
   summaryDiv.style.fontSize = 'small';
   summaryDiv.style.marginLeft = '5%';
   summaryDiv.style.marginRight = '5%';
   summaryDiv.innerHTML = content;
   this.routeInstructionsContainer.appendChild(summaryDiv);
 }
 
 
 /**
  * Creates a series of H.map.Marker points from the route and adds them to the map.
  * @param {Object} route A route as received from the H.service.RoutingService
  */
  addManueversToPanel(route) {
   var nodeOL = document.createElement('ol');
 
   nodeOL.style.fontSize = 'small';
   nodeOL.style.marginLeft ='5%';
   nodeOL.style.marginRight ='5%';
   nodeOL.className = 'directions';
 
   route.sections.forEach((section) => {
     section.actions.forEach((action, idx) => {
       var li = document.createElement('li'),
         spanArrow = document.createElement('span'),
         spanInstruction = document.createElement('span');
 
       spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
       spanInstruction.innerHTML = section.actions[idx].instruction;
       li.appendChild(spanArrow);
       li.appendChild(spanInstruction);
 
       nodeOL.appendChild(li);
     });
   });
 
   this.routeInstructionsContainer.appendChild(nodeOL);
 }
 
 toMMSS(duration) {
   return Math.floor(duration / 60) + ' minutes ' + (duration % 60) + ' seconds.';
 }
}

