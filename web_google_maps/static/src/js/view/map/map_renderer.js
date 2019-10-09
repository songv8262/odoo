odoo.define('web_google_maps.MapRenderer', function (require) {
    'use strict';

    var BasicRenderer = require('web.BasicRenderer');
    var core = require('web.core');
    var QWeb = require('web.QWeb');
    var session = require('web.session');
    var utils = require('web.utils');
    var Widget = require('web.Widget');
    var KanbanRecord = require('web.KanbanRecord');

    var qweb = core.qweb;

    var MapRecord = KanbanRecord.extend({
        init: function (parent, state, options) {
            this._super.apply(this, arguments);
            this.fieldsInfo = state.fieldsInfo.map;
        }
    });

    var markerColors = [
        'green', 'yellow', 'blue', 'light-green',
        'red', 'magenta', 'black', 'purple', 'orange',
        'pink', 'grey', 'brown', 'cyan', 'white'
    ];
    var styleJson =[{
        "featureType": "land",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#f1f1f1ff"
        }
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#54afebff"
        }
    }, {
        "featureType": "green",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#65a7fcff"
        }
    }, {
        "featureType": "building",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "building",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#ffffffb3"
        }
    }, {
        "featureType": "building",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#dadadab3"
        }
    }, {
        "featureType": "subwaystation",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#b15454B2"
        }
    }, {
        "featureType": "education",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#cdebffff"
        }
    }, {
        "featureType": "medical",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#cdebffff"
        }
    }, {
        "featureType": "scenicspots",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#cdebffff"
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "weight": 4
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#9dcaffff"
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#fed66900"
        }
    }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "highway",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#8f5a33ff"
        }
    }, {
        "featureType": "highway",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "highway",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "arterial",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "weight": 2
        }
    }, {
        "featureType": "arterial",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#428ee9ff"
        }
    }, {
        "featureType": "arterial",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#428ee900"
        }
    }, {
        "featureType": "arterial",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "arterial",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "arterial",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff"
        }
    }, {
        "featureType": "local",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "weight": 1
        }
    }, {
        "featureType": "local",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "local",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "local",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "local",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#979c9aff"
        }
    }, {
        "featureType": "local",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "railway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "weight": 1
        }
    }, {
        "featureType": "railway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#949494ff"
        }
    }, {
        "featureType": "railway",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "subway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "weight": 1
        }
    }, {
        "featureType": "subway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#d8d8d8ff"
        }
    }, {
        "featureType": "subway",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "subway",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "subway",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#979c9aff"
        }
    }, {
        "featureType": "subway",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "continent",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "continent",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "continent",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#333333ff"
        }
    }, {
        "featureType": "continent",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "city",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "city",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "city",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "city",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff",
            "weight": 3
        }
    }, {
        "featureType": "town",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "town",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "town",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#454d50ff"
        }
    }, {
        "featureType": "town",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#bddbfdff"
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff",
            "weight": 3
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "districtlabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "manmade",
        "elementType": "geometry",
        "stylers": {
            "color": "#cdebffff"
        }
    }, {
        "featureType": "restaurantlabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "restaurantlabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "lifeservicelabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "lifeservicelabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "carservicelabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "carservicelabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "financelabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "financelabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "otherlabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "otherlabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "companylabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "companylabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "businesstowerlabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "businesstowerlabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "estatelabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "estatelabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "highwaysign",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "highwaysign",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "nationalwaysign",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "nationalwaysign",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "provincialwaysign",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "provincialwaysign",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "tertiarywaysign",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "tertiarywaysign",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "subwaylabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "subwaylabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "nationalway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#78b6ffff"
        }
    }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#69acffff"
        }
    }, {
        "featureType": "entertainment",
        "elementType": "geometry",
        "stylers": {
            "color": "#cdebffff"
        }
    }, {
        "featureType": "estate",
        "elementType": "geometry",
        "stylers": {
            "color": "#cdebffff"
        }
    }, {
        "featureType": "shopping",
        "elementType": "geometry",
        "stylers": {
            "color": "#cdebffff"
        }
    }, {
        "featureType": "transportation",
        "elementType": "geometry",
        "stylers": {
            "color": "#cdebffff"
        }
    }, {
        "featureType": "tertiaryway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "tertiaryway",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "tertiaryway",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "tertiaryway",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff"
        }
    }, {
        "featureType": "districtlabel",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "districtlabel",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff"
        }
    }, {
        "featureType": "village",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "district",
        "elementType": "labels.text",
        "stylers": {
            "fontsize": 20
        }
    }, {
        "featureType": "district",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "district",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff"
        }
    }, {
        "featureType": "highway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 6
        }
    }, {
        "featureType": "highway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 7
        }
    }, {
        "featureType": "highway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 8
        }
    }, {
        "featureType": "highway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 9
        }
    }, {
        "featureType": "highway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 10
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 6
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 7
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 8
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 9
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 10
        }
    }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 6
        }
    }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 7
        }
    }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 8
        }
    }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 9
        }
    }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 10
        }
    }, {
        "featureType": "nationalway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 6
        }
    }, {
        "featureType": "nationalway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 7
        }
    }, {
        "featureType": "nationalway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 8
        }
    }, {
        "featureType": "nationalway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 9
        }
    }, {
        "featureType": "nationalway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 10
        }
    }, {
        "featureType": "nationalway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 6
        }
    }, {
        "featureType": "nationalway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 7
        }
    }, {
        "featureType": "nationalway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 8
        }
    }, {
        "featureType": "nationalway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 9
        }
    }, {
        "featureType": "nationalway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 10
        }
    }, {
        "featureType": "nationalway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 6
        }
    }, {
        "featureType": "nationalway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 7
        }
    }, {
        "featureType": "nationalway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 8
        }
    }, {
        "featureType": "nationalway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 9
        }
    }, {
        "featureType": "nationalway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,10",
            "level": 10
        }
    }, {
        "featureType": "district",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 8
        }
    }, {
        "featureType": "district",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 9
        }
    }, {
        "featureType": "district",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 10
        }
    }, {
        "featureType": "district",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 8
        }
    }, {
        "featureType": "district",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 9
        }
    }, {
        "featureType": "district",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 10
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "cityhighway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 6
        }
    }, {
        "featureType": "cityhighway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 7
        }
    }, {
        "featureType": "cityhighway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 8
        }
    }, {
        "featureType": "cityhighway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 9
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 6
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 7
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 8
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 9
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 6
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 7
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 8
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "curZoomRegion": "6,9",
            "level": 9
        }
    }, {
        "featureType": "districtlabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "country",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "country",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff",
            "weight": 6
        }
    }, {
        "featureType": "nationalway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "nationalway",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#ffffff00"
        }
    }, {
        "featureType": "provincialway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#8ec1ffff"
        }
    }, {
        "featureType": "educationlabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "educationlabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "governmentlabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "governmentlabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "educationlabel",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "educationlabel",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff",
            "weight": 3
        }
    }, {
        "featureType": "fourlevelway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "provincialway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#c8e1ffff"
        }
    }, {
        "featureType": "provincialway",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#ffffff0"
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels.text",
        "stylers": {
            "fontsize": 20
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "cityhighway",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#428ee9ff",
            "weight": 3
        }
    }, {
        "featureType": "provincialway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 8
        }
    }, {
        "featureType": "provincialway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 9
        }
    }, {
        "featureType": "provincialway",
        "stylers": {
            "curZoomRegionId": "0",
            "curZoomRegion": "8,10",
            "level": 10
        }
    }, {
        "featureType": "provincialway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "weight": 3,
            "curZoomRegion": "8,10",
            "level": 8
        }
    }, {
        "featureType": "provincialway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "weight": 3,
            "curZoomRegion": "8,10",
            "level": 9
        }
    }, {
        "featureType": "provincialway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "curZoomRegionId": "0",
            "weight": 3,
            "curZoomRegion": "8,10",
            "level": 10
        }
    }]
    function findInNode(node, predicate) {
        if (predicate(node)) {
            return node;
        }
        if (!node.children) {
            return undefined;
        }
        for (var i = 0; i < node.children.length; i++) {
            if (findInNode(node.children[i], predicate)) {
                return node.children[i];
            }
        }
    }

    function qwebAddIf(node, condition) {
        if (node.attrs[qweb.prefix + '-if']) {
            condition = _.str.sprintf("(%s) and (%s)", node.attrs[qweb.prefix + '-if'], condition);
        }
        node.attrs[qweb.prefix + '-if'] = condition;
    }

    function transformQwebTemplate(node, fields) {
        // Process modifiers
        if (node.tag && node.attrs.modifiers) {
            var modifiers = node.attrs.modifiers || {};
            if (modifiers.invisible) {
                qwebAddIf(node, _.str.sprintf("!kanban_compute_domain(%s)", JSON.stringify(modifiers.invisible)));
            }
        }
        switch (node.tag) {
            case 'button':
            case 'a':
                var type = node.attrs.type || '';
                if (_.indexOf('action,object,edit,open,delete,url,set_cover'.split(','), type) !== -1) {
                    _.each(node.attrs, function (v, k) {
                        if (_.indexOf('icon,type,name,args,string,context,states,kanban_states'.split(','), k) !== -1) {
                            node.attrs['data-' + k] = v;
                            delete(node.attrs[k]);
                        }
                    });
                    if (node.attrs['data-string']) {
                        node.attrs.title = node.attrs['data-string'];
                    }
                    if (node.tag === 'a' && node.attrs['data-type'] !== "url") {
                        node.attrs.href = '#';
                    } else {
                        node.attrs.type = 'button';
                    }

                    var action_classes = " oe_kanban_action oe_kanban_action_" + node.tag;
                    if (node.attrs['t-attf-class']) {
                        node.attrs['t-attf-class'] += action_classes;
                    } else if (node.attrs['t-att-class']) {
                        node.attrs['t-att-class'] += " + '" + action_classes + "'";
                    } else {
                        node.attrs['class'] = (node.attrs['class'] || '') + action_classes;
                    }
                }
                break;
        }
        if (node.children) {
            for (var i = 0, ii = node.children.length; i < ii; i++) {
                transformQwebTemplate(node.children[i], fields);
            }
        }
    }

    var SidebarGroup = Widget.extend({
        template: 'MapView.MapViewGroupInfo',
        init: function (parent, options) {
            this._super.apply(this, arguments);
            this.groups = options.groups;
        }
    });

    var MapRenderer = BasicRenderer.extend({
        className: 'o_map_view',
        template: 'MapView.MapView',
        /**
         * @override
         */
        init: function (parent, state, params) {
            this._super.apply(this, arguments);
            this.mapLibrary = params.mapLibrary;
            this.widgets = [];

            this.qweb = new QWeb(session.debug, {
                _s: session.origin
            }, false);
            var templates = findInNode(this.arch, function (n) {
                return n.tag === 'templates';
            });
            transformQwebTemplate(templates, state.fields);
            this.qweb.add_template(utils.json_node_to_xml(templates));
            this.recordOptions = _.extend({}, params.record_options, {
                qweb: this.qweb,
                viewType: 'map',
            });
            this.state = state;
            this.shapesCache = {};
            this._initLibraryProperties(params);
        },
        _initLibraryProperties: function (params) {
            if (this.mapLibrary === 'drawing') {
                this.drawingMode = params.drawingMode || 'shape_type';
                this.drawingPath = params.drawingPath || 'shape_paths';
                this.shapesLatLng = [];
            } else if (this.mapLibrary === 'geometry') {
                this.defaultMarkerColor = 'red';
                this.markerGroupedInfo = [];
                this.iconColors = markerColors;
                this.markers = [];
                this.iconUrl = '/web_google_maps/static/src/img/markers/';
                this.fieldLat = params.fieldLat;
                this.fieldLng = params.fieldLng;
                this.markerColor = params.markerColor;
                this.markerColors = params.markerColors;
                this.groupedMarkerColors = _.extend([], params.iconColors);
            }
        },
        /**
         * @override
         */
        updateState: function (state) {
            this.state = state;
            return this._super.apply(this, arguments);
        },
        /**
         * @override
         */
        start: function () {
            this._initMap();
            return this._super();
        },
        /**
         * Style the map
         * @private
         */
        /**
         * Initialize map
         * @private
         */
        _initMap: function () {
            this.infoWindow = new BMap.InfoWindow();
            this.$('.o_map_view').empty();
            this.markers = [];
            this.gmap = new BMap.Map(this.$('.o_map_view').get(0), {
                minZoom: 4,
                maxZoom: 19,
            });
            this.gpoint = new BMap.Point(116.404, 39.915); // 创建点坐标
            this.gmap.addControl(new BMap.MapTypeControl());
            this.gmap.enableScrollWheelZoom();
            this.gmap.enableContinuousZoom();
            this.mapWforGPS = new BMapLib.MapWrapper(this.gmap, BMapLib.COORD_TYPE_GPS);
            this.gmap.addEventListener("tilesloaded",this._dw());
            var navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                // 启用显示定位
                enableGeolocation: true
              });
            this.gmap.addControl(navigationControl);
//            this.gmap.setMapStyleV2({styleJson:styleJson});  
            this.$right_sidebar = this.$('.o_map_right_sidebar');
            this.markerCluster = new BMapLib.MarkerClusterer(this.gmap, {markers:this.markers});

			//下中提示
			function onoffdiv() {
				this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;				
				this.defaultOffset = new BMap.Size(10, 10);
			};
			onoffdiv.prototype = new BMap.Control();
			onoffdiv.prototype.initialize = function(map) {					
				var div = document.createElement("div");
				div.className='o_kanban_map_onoff';
				div.innerHTML='
				<icon><img src="/web_google_maps/static/src/img/markers/light-green.png" alt=""><span class="_kanban_map_texton">开灯</span></icon>
				<icon><img src="/web_google_maps/static/src/img/markers/red.png" alt=""><span class="_kanban_map_textoff">关灯</span></icon>
				<icon><img src="/web_google_maps/static/src/img/markers/grey.png" alt=""><span class="_kanban_map_textunknow">断连</span></icon>
				';
				map.getContainer().appendChild(div);
				return div;
			};
			var onoffdiv = new onoffdiv();
			this.gmap.addControl(onoffdiv);
			
			
			// 
			// //左下详情轮播
			// function onoffform() {
			// 	this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;				
			// 	this.defaultOffset = new BMap.Size(0, 0);
			// };
			// onoffform.prototype = new BMap.Control();		
			// onoffform.prototype.initialize = function(map){	
			// 	var self = this;			
			// 	var div = document.createElement("div");
			// 	div.className='o_kanban_map_form';
			// 	// _.each(this.renderer.state.data, function (record) {
			// 	//     div.innerHTML+='<div class="o_kanban_map_form_div"><span>'+record.data.display_name+'</span></div>';
			// 	// });
			// 	div.innerHTML='
			// 	<div class="o_kanban_map_form_div"><span>用户</span><span>开灯状态</span><span>属性</span></div>
			// 	<div class="o_kanban_map_form_ul">
			// 		<ul>
			// 			<li><span>1</span><span>开</span><span>早上吃包子</span></li>
			// 			<li><span>2</span><span>开</span><span>中午吃米饭</span></li>
			// 			<li><span>3</span><span>开</span><span>晚上吃面条</span></li>
			// 			<li><span>4</span><span>开</span><span>宵夜吃烧烤</span></li>
			// 			<li><span>5</span><span>开</span><span>睡前喝牛奶</span></li>
			// 		</ul>
			// 	</div>';
			// 	map.getContainer().appendChild(div);
			// 	return div;
			// };
			// var onoffform = new onoffform();
			// this.gmap.addControl(onoffform);
			// 
			
			
			//右上天气预报
			// function weatherdiv() {
			// 	this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;				
			// 	this.defaultOffset = new BMap.Size(0, 40);
			// };
			// weatherdiv.prototype = new BMap.Control();
			// weatherdiv.prototype.initialize = function(map) {			
			// 	var div = document.createElement("div");
			// 	div.className='o_kanban_map_silder_weather';
			// 	div.id = "mydiv";
			// 	var httpRequest = new XMLHttpRequest();
			// 	httpRequest.open('GET', 'https://www.tianqiapi.com/api/?version=v1&appid=1001&appsecret=5566', true);
			// 	httpRequest.send();
			// 	httpRequest.onreadystatechange = function () {
			// 		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			// 			var json = httpRequest.responseText;
			// 			var Json=JSON.parse(json);	
			// 			div.innerHTML=
			// 			'<div id="weatherdiv"><div><p>'+Json.city+'</p>'+	
			// 			'<p>'+Json.data[0].tem2+'~'+Json.data[0].tem1+'</p>'+
			// 			'<p>'+Json.data[0].wea+'</p>'+					
			// 			'<p>'+Json.data[0].week+'</p>'+
			// 			'<p>'+Json.data[0].date+'</p></div></div><div id="weatheronoff"><img src="/web_google_maps/static/src/img/retract.png"></div>';
			// 			var flag=false;
			// 			document.getElementById('weatheronoff').addEventListener('click', function() {
			// 				flag=!flag;
			// 				var div=document.getElementById('weatherdiv');
			// 				var onoff=document.getElementById('weatheronoff');
			// 				if (flag) {							
			// 					div.style.height="20px";
			// 					onoff.style.marginTop="0px";
			// 					setTimeout(function () {
			// 						div.style.width="0px";
			// 						onoff.innerHTML='<img src="/web_google_maps/static/src/img/open.png">';
			// 					},500)
			// 				} else{							
			// 					div.style.width="80px";		
			// 					setTimeout(function () {
			// 						div.style.height="80px";
			// 						onoff.style.marginTop="60px";			
			// 					},250)
			// 					setTimeout(function () {
			// 						onoff.innerHTML='<img src="/web_google_maps/static/src/img/retract.png">';
			// 					},750)
			// 				}
			// 			});
			// 		}
			// 	};
			// 	map.getContainer().appendChild(div);
			// 	return div;
			// };	
			// 
			// var weatherdiv = new weatherdiv();
			// this.gmap.addControl(weatherdiv);
			
			
			
			
			// setTimeout(this._dw,2000);
        },
        /**
         * Compute marker color
         * @param {any} record
         * @return string
         */
        /**
         * Create marker
         * @param {any} latLng: instance of google LatLng
         * @param {any} record
         * @param {string} color
         */
        _renderMarkers: function () {
            var isGrouped = !!this.state.groupedBy.length;
            if (isGrouped) {
                this._renderGrouped();
            } else {
                this._renderUngrouped();
            }
        },
        _renderGrouped: function () {
            var self = this;
            var color;
            var latLng;

            _.each(this.state.data, function (record) {
                color = self._getGroupedMarkerColor();
                record.markerColor = color;
                _.each(record.data, function (rec) {
                    latLng = new BMap.Point(rec.data[self.fieldLat], rec.data[self.fieldLng]);
                    self._createMarker(latLng, rec, color);
                });
                self.markerGroupedInfo.push({
                    'title': record.value || 'Undefined',
                    'count': record.count,
                    'marker': self.iconUrl + record.markerColor.trim() + '.png'
                });
            });
        },
        _renderUngrouped: function () {
            var self = this;
            var color;
            var latLng;

            _.each(this.state.data, function (record) {
                color = self._getIconColor(record);
                latLng =new BMap.Point(record.data[self.fieldLat], record.data[self.fieldLng]);
                record.markerColor = color;
                self._createMarker(latLng, record, color);
            });
        },
        _createMarker: function (latLng, record, color) {
            var options = {
                position: latLng,
                map: this.gmap,
                _odooRecord: record
            };
            if (color) {
                var icon = this.iconUrl + color.trim() + '.png';
            }
            var myIcon = new BMap.Icon(icon, new BMap.Size(50,50));
            var marker = new BMap.Marker(latLng,{icon:myIcon});
            this.mapWforGPS.addOverlay(marker);
            marker.setAnimation(BMAP_ANIMATION_DROP);
            this.markers.push(marker);
            marker._odooRecord=record;
            this._clusterAddMarker(marker);
        },
        _clusterAddMarker: function (marker) {
            var _position;
            var markerInClusters = this.markerCluster.getMarkers();
            var existingRecords = [];
            if (markerInClusters.length > 0) {
                markerInClusters.forEach(function (_cMarker) {
                    _position = _cMarker.getPosition();
                    if (marker.getPosition().equals(_position)) {
                        existingRecords.push(_cMarker._odooRecord);
                    }
                });
            }
            this.markerCluster.addMarker(marker);
            marker.addEventListener('click', this._markerInfoWindow.bind(this, marker, existingRecords));
        },
        _markerInfoWindow: function (marker, currentRecords) {	
			var self = this;
			// var longitude = marker.getPosition().lng;
			// var latitude = marker.getPosition().lat;
			// var point = new BMap.Point(longitude,latitude);			
			// var geoc = new BMap.Geocoder();
			// geoc.getLocation(point, function(rs){
			// 	var addComp = rs.addressComponents.district;				
			// 	addComp = addComp.substr(0, addComp.length - 1);
			// 	var httpRequest = new XMLHttpRequest();
			// 	httpRequest.open('GET', "https://www.tianqiapi.com/api/?version=v1&city="+addComp+"&appid=1001&appsecret=5566", true);
			// 	httpRequest.send();
			// 	httpRequest.onreadystatechange = function () {
			// 		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			// 			var json = httpRequest.responseText;
			// 			var Json=JSON.parse(json);	
			// 			document.getElementById('weatherdiv').innerHTML=
			// 			'<div><p>'+Json.city+'</p>'+	
			// 			'<p>'+Json.data[0].tem2+'~'+Json.data[0].tem1+'</p>'+
			// 			'<p>'+Json.data[0].wea+'</p>'+					
			// 			'<p>'+Json.data[0].week+'</p>'+
			// 			'<p>'+Json.data[0].date+'</p></div>';
			// 			var _content = '';
			// 			var markerRecords = [];
			// 			var markerDiv = document.createElement('div');
			// 			markerDiv.className = 'o_map_window';
			// 			var markerContent = document.createElement('div');
			// 			markerContent.className = 'o_kanban_group';
			// 			if (currentRecords.length > 0) {
			// 			    currentRecords.forEach(function (_record) {
			// 			    _content = self._generateMarkerInfoWindow(_record);
			// 			    markerRecords.push(_content);
			// 			    _content.appendTo(markerContent);			
			// 				});
			// 			}
			// 			var markerIwContent = self._generateMarkerInfoWindow(marker._odooRecord);
			// 			markerIwContent.appendTo(markerContent);
			// 			markerDiv.appendChild(markerContent);
			// 			self.infoWindow.setContent(markerDiv);
			// 			self.gmap.openInfoWindow(self.infoWindow,marker.getPosition());
			// 		}
			// 	};
			// });
			
			
			var _content = '';
			var markerRecords = [];
			var markerDiv = document.createElement('div');
			markerDiv.className = 'o_map_window';
			var markerContent = document.createElement('div');
			markerContent.className = 'o_kanban_group';
			if (currentRecords.length > 0) {
			    currentRecords.forEach(function (_record) {
			    _content = self._generateMarkerInfoWindow(_record);
			    markerRecords.push(_content);
			    _content.appendTo(markerContent);			
				});
			}
			var markerIwContent = self._generateMarkerInfoWindow(marker._odooRecord);
			markerIwContent.appendTo(markerContent);
			markerDiv.appendChild(markerContent);
			self.infoWindow.setContent(markerDiv);
			self.gmap.openInfoWindow(self.infoWindow,marker.getPosition());
        },
        _generateMarkerInfoWindow: function (record) {
            var markerIw = new MapRecord(this, record, this.recordOptions);
            return markerIw;
        },
        _getGroupedMarkerColor: function () {
            var color;
            if (this.groupedMarkerColors.length) {
                color = this.groupedMarkerColors.splice(0, 1)[0];
            } else {
                this.groupedMarkerColors = _.extend([], this.iconColors);
                color = this.groupedMarkerColors.splice(0, 1)[0];
            }
            return color;
        },
        _getIconColor: function (record) {
            if (this.markerColor) {
                return this.markerColor;
            }

            if (!this.markerColors) {
                return this.defaultMarkerColor;
            }

            var context = _.mapObject(_.extend({}, record.data, {
                uid: session.uid,
                current_date: moment().format('YYYY-MM-DD') // TODO: time, datetime, relativedelta
            }), function (val, key) {
                return (val instanceof Array) ? (_.last(val) || '') : val;
            });
            for (var i = 0; i < this.markerColors.length; i++) {
                var pair = this.markerColors[i];
                var color = pair[0];
                var expression = pair[1];
                if (py.PY_isTrue(py.evaluate(expression, context))) {
                    return color;
                }
                // TODO: handle evaluation errors
            }
            return '';
        },
		
		
		//渲染视图
        _renderView: function () {
            var self = this;
            this.markerGroupedInfo.length = 0;
            this.gmap.clearOverlays();
            this._clearMarkerClusters();
            this._renderMarkers();
            this.markerCluster.addMarkers(this.markers);
            var b = new BMap.Bounds(new BMap.Point(50,-30), new BMap.Point(150, 90));
            try {   
                BMapLib.AreaRestriction.setBounds(this.gmap, b);
            } catch (e) {
                alert(e);
            }
            return this._super.apply(this, arguments)
                .then(self._renderSidebarGroup.bind(self))
                .then(self.mapGeometryCentered.bind(self));
            return this._super.apply(this, arguments);
        },
        _dw: function () {
            this.gmap.centerAndZoom(this.gpoint,15);
        },
        _dw2: function () {
            alert('加载地图！');
        },
        _clearMarkerClusters: function () {
            // this.markerCluster.clearMarkers();
            this.markerCluster.clearMarkers();
            this.markers = [];
        },
        mapGeometryCentered: function () {
            var self = this;
            var mapBounds = new BMap.Bounds();

            _.each(this.markers, function (marker) {
                mapBounds.extend(marker.getPosition());
            });
            var view = this.gmap.getViewport(mapBounds);
            var mapZoom = view.zoom;
            this.gmap.centerAndZoom(mapBounds.getCenter(), mapZoom);
        },
        _renderSidebarGroup: function () {
            var self = this;
            if (this.markerGroupedInfo.length > 0) {
                this.$right_sidebar.empty().removeClass('closed').addClass('open');
                var groupInfo = new SidebarGroup(this, {
                    'groups': this.markerGroupedInfo
                });
                groupInfo.appendTo(this.$right_sidebar);
            } else {
                this.$right_sidebar.empty();
                if (!this.$right_sidebar.hasClass('closed')) {
                    this.$right_sidebar.removeClass('open').addClass('closed');
                }
            }
        },
		

		
        /**
         * Handle Multiple Markers present at the same coordinates
         */
        /**
         * Marker info window
         * @param {any} marker: instance of google marker
         * @param {any} record
         * @return function
         */
        /**
         * @private
         */
        /**
         * Render markers
         * @private
         * @param {Object} record
         */
        /**
         * Get color
         * @returns {string}
         */
        /**
         * @override
         */
        /**
         * Cluster markers
         * @private
         */
        /**
         * Centering map
         */
        /**
         * Centering map
         */
        /**
         * Clear marker clusterer and list markers
         * @private
         */
        /**
         * Render a sidebar for grouped markers info
         * @private
         */
        /**
         * Sets the current state and updates some internal attributes accordingly.
         *
         * @private
         * @param {Object} state
         */
        _setState: function (state) {
            this.state = state;

            var groupByFieldAttrs = state.fields[state.groupedBy[0]];
            var groupByFieldInfo = state.fieldsInfo.map[state.groupedBy[0]];
            // Deactivate the drag'n'drop if the groupedBy field:
            // - is a date or datetime since we group by month or
            // - is readonly (on the field attrs or in the view)
            var draggable = false;
            if (groupByFieldAttrs) {
                if (groupByFieldAttrs.type === "date" || groupByFieldAttrs.type === "datetime") {
                    draggable = false;
                } else if (groupByFieldAttrs.readonly !== undefined) {
                    draggable = !(groupByFieldAttrs.readonly);
                }
            }
            if (groupByFieldInfo) {
                if (draggable && groupByFieldInfo.readonly !== undefined) {
                    draggable = !(groupByFieldInfo.readonly);
                }
            }
            this.groupedByM2O = groupByFieldAttrs && (groupByFieldAttrs.type === 'many2one');
        },
    });

    return MapRenderer;

});