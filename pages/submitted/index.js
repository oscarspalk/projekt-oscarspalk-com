/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import {
  Text,
  Grid,
  Description,
  Page,
  Select,
  Toggle,
  Loading,
  Divider,
  Collapse,
} from "@geist-ui/react";
import { useEffect, useState } from "react";

import PlaceCard from "../../components/PlaceCard";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() =>
  import("react-leaflet").then((leaftlet) => leaftlet.MapContainer)
);

const ActivityCard = dynamic(() =>
  import('../../components/ActivityCard')
)

const Polyline = dynamic(() =>
  import("react-leaflet").then((leaftlet) => leaftlet.Polyline)
);

const Marker = dynamic(() =>
  import("react-leaflet").then((leaftlet) => leaftlet.Marker)
);

const TileLayer = dynamic(() =>
  import("react-leaflet").then((leaftlet) => leaftlet.TileLayer)
);

const Popup = dynamic(() =>
  import("react-leaflet").then((leaftlet) => leaftlet.Popup)
);

export default function Home() {
  const months = [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ];
  const [activityAr, setActivityAr] = useState([]);
  const [month, setMonth] = useState(0);
  const [lowestDate, setLowestDate] = useState(0);
  const [highestDate, setHighestDate] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [kmTraveled, setKmTraveled] = useState(0);
  const [placesVisited, setPlacesVisited] = useState(0);
  const [hrSpentTraveling, setHrSpentTravelling] = useState(0);
  const [home, setHome] = useState("");
  const [places, setPlaces] = useState([]);
  const [year, setYear] = useState(0);
  const [showActivities, setShowActivities] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);
  const [avaibleDates, setAvaibleDates] = useState([]);
  const [alleDage, setAlleDage] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [renderedObjects, setRenderedObjects] = useState([]);
  const [rObjectsLength, setRObjectsLength] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  useEffect(() => {
    loadStorage();
  }, []);

  const loadStorage = () => {
    setActivityAr(
      JSON.parse(sessionStorage.getItem("mapData")).timelineObjects
    );
  };
  useEffect(() => {
    loadBasicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityAr]);

  const loadBasicData = () => {
    if (activityAr.length > 2) {
      var firstD = new Date(
        parseInt(
          activityAr[0].activitySegment
            ? activityAr[0].activitySegment.duration.startTimestampMs
            : activityAr[0].placeVisit.duration.startTimestampMs
        )
      );
      var lastD = new Date(
        parseInt(
          activityAr[activityAr.length - 1].activitySegment
            ? activityAr[0].activitySegment.duration.startTimestampMs
            : activityAr[activityAr.length - 1].placeVisit.duration
                .startTimestampMs
        )
      );
      setYear(firstD.getFullYear());
      setMonth(firstD.getMonth());
      setLowestDate(firstD.getDate());
      setHighestDate(lastD.getDate());
      var tempKM = 0;
      var placeVisited = 0;
      var tempHRsT = 0;
      var arrOfPlaces = [];
      for (var i = 0; i < activityAr.length; i++) {
        if (activityAr[i].activitySegment != undefined) {
          var aktivitet = activityAr[i].activitySegment;
          if (aktivitet.distance != undefined) {
            tempKM = tempKM + aktivitet.distance;
          }

          var startmilli = parseInt(aktivitet.duration.startTimestampMs);
          var endmilli = parseInt(aktivitet.duration.endTimestampMs);
          tempHRsT += (endmilli - startmilli) / 1000 / 60 / 60;
        } else {
          arrOfPlaces.push(activityAr[i].placeVisit.location.name);
          placeVisited++;
        }
      }
      var result = [];
      for (var i = 0; i < arrOfPlaces.length; ++i) {
        if (!result[arrOfPlaces[i]]) result[arrOfPlaces[i]] = 0;
        ++result[arrOfPlaces[i]];
      }
      setPlaces(result);
      setKmTraveled(parseInt(tempKM / 1000));
      setPlacesVisited(placeVisited);
      setHrSpentTravelling(tempHRsT);
    }
  };

  useEffect(() => {
    var biggest = 0;
    var finalHome = "";
    for (const property in places) {
      if (places[property] > biggest) {
        finalHome = property;
        biggest = places[property];
      }
    }
    setHome(finalHome);
  }, [places]);

  useEffect(() => {
    var availDates = [];
    for (var i = lowestDate; i < highestDate + 1; i++) {
      availDates.push(parseInt(i));
    }
    setAvaibleDates(availDates);
  }, [lowestDate, highestDate]);

  useEffect(() => {
    var marks = [];
    var activitiesTemp = [];

    setRenderedObjects(
      activityAr != [] &&
        activityAr != undefined &&
        (showActivities || showPlaces) &&
        (alleDage || selectedDates.length > 0) ? (
        activityAr.map((activity, index) => {
          var dateSelector;
          if (activity.activitySegment != undefined) {
            dateSelector = new Date(
              parseInt(activity.activitySegment.duration.startTimestampMs)
            );
          } else {
            dateSelector = new Date(
              parseInt(activity.placeVisit.duration.startTimestampMs)
            );
          }
          if (selectedDates.length > 0 && !alleDage) {
            for (let l = 0; l < selectedDates.length; l++) {
              if (dateSelector.getDate() === selectedDates[l]) {
                if (activity.activitySegment != undefined && showActivities) {
                  var segment = activity.activitySegment;
                  var startlocation = [
                    segment.startLocation.latitudeE7 / 10000000,
                    segment.startLocation.longitudeE7 / 10000000,
                  ];
                  var endlocation = [
                    segment.endLocation.latitudeE7 / 10000000,
                    segment.endLocation.longitudeE7 / 10000000,
                  ];

                  var waypointsArray =
                    segment.waypointPath &&
                    segment.waypointPath.waypoints.map((waypoint) => {
                      var lat = waypoint.latE7 / 10000000;
                      var long = waypoint.lngE7 / 10000000;

                      return [lat, long];
                    });

                  var path =
                    waypointsArray != undefined
                      ? [startlocation]
                          .concat(waypointsArray)
                          .concat([endlocation])
                      : [startlocation, endlocation];

                  const lineOptions = { color: "red" };
                  var activityPart = (
                    <Polyline
                      key={index}
                      pathOptions={lineOptions}
                      positions={path}
                    />
                  );
                  activitiesTemp.push(activityPart);
                  return <ActivityCard key={index} activity={segment} />;
                } else if (showPlaces && activity.placeVisit != undefined) {
                  var place = activity.placeVisit;
                  var lat = place.location.latitudeE7 / 10000000;
                  var long = place.location.longitudeE7 / 10000000;
                  var mark = {
                    latitude: lat,
                    longitude: long,
                    name: place.location.name,
                  };
                  marks.push(mark);
                  return <PlaceCard key={index} place={place} />;
                }
              }
            }
          } else if (alleDage) {
            if (activity.activitySegment != undefined && showActivities) {
              var segment = activity.activitySegment;
              var startlocation = [
                segment.startLocation.latitudeE7 / 10000000,
                segment.startLocation.longitudeE7 / 10000000,
              ];
              var endlocation = [
                segment.endLocation.latitudeE7 / 10000000,
                segment.endLocation.longitudeE7 / 10000000,
              ];

              var waypointsArray =
                segment.waypointPath &&
                segment.waypointPath.waypoints.map((waypoint) => {
                  var lat = waypoint.latE7 / 10000000;
                  var long = waypoint.lngE7 / 10000000;

                  return [lat, long];
                });

              var path =
                waypointsArray != undefined
                  ? [startlocation].concat(waypointsArray).concat([endlocation])
                  : [startlocation, endlocation];

              const lineOptions = { color: "red" };
              var activityPart = (
                <Polyline
                  key={index}
                  pathOptions={lineOptions}
                  positions={path}
                />
              );
              activitiesTemp.push(activityPart);
              return <ActivityCard key={index} activity={segment} />;
            } else if (showPlaces && activity.placeVisit != undefined) {
              var place = activity.placeVisit;
              var lat = place.location.latitudeE7 / 10000000;
              var long = place.location.longitudeE7 / 10000000;
              var mark = {
                latitude: lat,
                longitude: long,
                name: place.location.name,
              };
              marks.push(mark);
              return <PlaceCard key={index} place={place} />;
            }
          }
        })
      ) : (
        <Text h3>Slå et filter fra for at vise nogle aktiviteter.</Text>
      )
    );
    setMarkers(marks);
    setActivities(activitiesTemp);
  }, [activityAr, selectedDates, alleDage, showActivities, showPlaces]);
  const average = (array) => {
    return array != [] ? array.reduce((a, b) => a + b, 0) / array.length : 0, 0;
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      {home ? (
        <Page margin={0} width="100%">
          <div>
            <Text h1>{months[month] + " " + year}</Text>

            <Grid.Container gap={2}>
              <Grid>
                <Description title="Kilometer rejst" content={kmTraveled} />
              </Grid>
              <Grid>
                <Description title="Steder besøgt" content={placesVisited} />
              </Grid>
              <Grid>
                <Description
                  title="Timer rejst"
                  content={parseInt(hrSpentTraveling)}
                />
              </Grid>
              <Grid>
                <Description title="Dit Hjem" content={home} />
              </Grid>
              <Grid>
                <Description
                  title="Vis Aktiviteter"
                  content={
                    <Toggle
                      onChange={(e) => setShowActivities(e.target.checked)}
                      initialChecked
                    />
                  }
                />
              </Grid>
              <Grid>
                <Description
                  title="Vis Steder"
                  content={
                    <Toggle
                      initialChecked
                      onChange={(e) => setShowPlaces(e.target.checked)}
                    />
                  }
                />
              </Grid>
              <Grid>
                <Description
                  title="Vis alle dage"
                  content={
                    <Toggle
                      onChange={(e) => setAlleDage(e.target.checked)}
                      initialChecked
                    />
                  }
                />
              </Grid>
              {avaibleDates != [] ? (
                <Grid>
                  <Description
                    title="Vælg Dato"
                    content={
                      <Select
                        pure
                        width="200px"
                        multiple
                        disabled={alleDage}
                        onChange={(e) => {
                          var numArr = [];
                          if (e.length > 0) {
                            for (var i = 0; i < e.length; i++) {
                              numArr.push(parseInt(e[i]));
                            }
                          }
                          setSelectedDates(numArr);
                        }}
                      >
                        <Divider />
                        {avaibleDates.map((number, index) => {
                          return (
                            <Select.Option
                              key={index + 1}
                              value={number.toString()}
                            >
                              {number.toString()}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    }
                  />
                </Grid>
              ) : null}
            </Grid.Container>
          </div>
          <Collapse
            mt={2}
            shadow
            title="Kort"
            subtitle="Se din lokationshistorik på et kort."
          >
            <div style={{ height: "500px", display: "flex" }}>
              <MapContainer
                style={{ flexGrow: 1, borderRadius: "5px" }}
                center={[55.769428, 10.671679]}
                zoom={6}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {markers != []
                  ? markers.map((mark, index) => (
                      <Marker
                        key={index}
                        position={[mark.latitude, mark.longitude]}
                      >
                        <Popup>{mark.name}</Popup>
                      </Marker>
                    ))
                  : null}
                {activities}
              </MapContainer>
            </div>
          </Collapse>
          <Grid.Container mt={2} wrap="wrap" justify="center" gap={3}>
            {renderedObjects}
          </Grid.Container>
        </Page>
      ) : (
        <Loading />
      )}
    </>
  );
}
