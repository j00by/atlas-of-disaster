mapboxgl.accessToken = 'pk.eyJ1IjoiajAwYnkiLCJhIjoiY2x1bHUzbXZnMGhuczJxcG83YXY4czJ3ayJ9.S5PZpU9VDwLMjoX_0x5FDQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-91.874, 31.168],
    zoom: 6
});

map.on('load', function () {
    // Load the GeoJSON file for congressional districts with representative names
    map.addSource('districts', {
        type: 'geojson',
        data: '/data/State22Names.geojson'
    });

    // Add a layer for districts
    map.addLayer({
        'id': 'districts-layer',
        'type': 'fill',
        'source': 'districts',
        'paint': {
            'fill-color': '#888888',  // Existing fill color
            'fill-opacity': 0.4,      // Existing opacity
            'fill-outline-color': '#000000'  // Setting black as the border color
        }
    });

    // Line layer specifically for district borders
    map.addLayer({
        'id': 'districts-border',
        'type': 'line',
        'source': 'districts',
        'layout': {},
        'paint': {
            'line-color': '#000000',  // Black border color
            'line-width': 2  // Adjust line width here for thicker borders
        }
    });

    // Load the GeoJSON file for counties and fema declaration count
    map.addSource('counties', {
        type: 'geojson',
        data: '/data/State22Counties.geojson'
    });

    // Add a layer for counties
    map.addLayer({
        'id': 'counties-layer',
        'type': 'fill',
        'source': 'counties',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'FEMA_TOTAL_FEMA_DISASTERS'],  // Retrieves the disaster count from the properties
                '#e6e6e5',  // Default color for 0 occurrences
                1, '#f8e0de',  // 1 to 2 occurrences
                3, '#f5c6c2',  // 3 to 4 occurrences
                5, '#eea3b6',  // 5 to 6 occurrences
                7, '#e770a1',  // 7 to 9 occurrences
                10, '#9c335d'  // 10+ occurrences
            ],
            'fill-outline-color': '#ffffff'  // White border for each county
        }
    });


    // When a user clicks on a district, show a popup with contact information
    map.on('click', 'districts-layer', function (e) {
        const props = e.features[0].properties;

        const popupHtml = `
        <div style="min-width: 200px;">
            <img src="${props.PHOTOURL}" alt="Profile Picture" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; display: block; margin-left: auto; margin-right: auto;">
            <h4>${props.NAMELSAD20}</h4>
            <p><strong>${props.FIRSTNAME} ${props.LASTNAME} (${props.PARTY})</strong></p>
            <p>Empower your community by sharing this interactive map with your congressional district representative to advocate for resilient infrastructure!</p>
            <p><a href="${props.WEBSITEURL}" target="_blank"><img src="/images/id-card.svg" alt="Website" style="width: 24px; height: 24px;"></a>
               <a href="${props.FACE_BOOK_URL}" target="_blank"><img src="/images/facebook.svg" alt="Facebook" style="width: 24px; height: 24px;"></a>
               <a href="${props.TWITTER_URL}" target="_blank"><img src="/images/twitter.svg" alt="Twitter" style="width: 24px; height: 24px;"></a>
               <a href="${props.INSTAGRAM_URL}" target="_blank"><img src="/images/instagram.svg" alt="Instagram" style="width: 24px; height: 24px;"></a>
            </p>
        </div>
    `;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupHtml)
            .addTo(map);
    });


    map.on('mouseenter', 'districts-layer', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'districts-layer', function () {
        map.getCanvas().style.cursor = '';
    });

    // Information box top left for methodology
    document.getElementById('info-icon').addEventListener('click', function () {
        var infoPanel = document.getElementById('info-panel');
        if (infoPanel.style.display === 'none') {
            infoPanel.style.display = 'block';
        } else {
            infoPanel.style.display = 'none';
        }
    });

});