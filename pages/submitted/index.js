/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import {
  Text,
  Grid,
  Card,
  Button,
  Description,
  Page,
  Spacer,
  Select,
  Slider,
  Modal,
  Table,
  Toggle,
} from "@geist-ui/react";
import MapPin from "@geist-ui/react-icons/mapPin";
import { useEffect, useCallback, useState } from "react";
export default function Home() {
  const activities = [
    { kode: "CYCLING", dk: "Cyklende" },
    { kode: "IN_PASSENGER_VEHICLE", dk: "Passager i bil" },
    { kode: "MOTORCYCLING", dk: "Kører på motorcykel" },
    { kode: "WALKING", dk: "Gående" },
    { kode: "RUNNING", dk: "Løbende" },
    { kode: "IN_BUS", dk: "Kører i bus" },
    { kode: "STILL", dk: "Står stille" },
    { kode: "IN_FERRY", dk: "Sejler med en færge" },
    { kode: "IN_TRAIN", dk: "Kører med tog" },
    { kode: "SKIING", dk: "Står på ski" },
    { kode: "IN_SUBWAY", dk: "Kører med metro" },
    { kode: "IN_TRAM", dk: "Kører med sporvogn" },
    { kode: "SAILING", dk: "Sejler" },
    { kode: "FLYING", dk: "Flyver" },
    { kode: "IN_VEHICLE", dk: "Kører bil" },
  ];
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
  const [activeArr, setActiveArr] = useState([]);
  const [activityAr, setActivityAr] = useState([]);
  const [month, setMonth] = useState(0);
  const [lowestDate, setLowestDate] = useState(0);
  const [highestDate, setHighestDate] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [kmTraveled, setKmTraveled] = useState(0);
  const [placesVisited, setPlacesVisited] = useState(0);
  const [hrSpentTraveling, setHrSpentTravelling] = useState(0);
  const [home, setHome] = useState("");
  const [places, setPlaces] = useState([]);
  const [year, setYear] = useState(0);
  const [showActivities, setShowActivities] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);
  const [avaibleDates, setAvaibleDates] = useState([]);
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


  const list = [
    143,41,42,424,1241,41241
  ];
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Page>
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
            {avaibleDates != [] ? (
              <Grid>
                <Description
                  title="Vælg Dato"
                  content={
                    <Select initialValue="0" onChange={(e) => setSelectedDate(parseInt(e))}>
                      <Select.Option value="0">Alle</Select.Option>
                      {avaibleDates.map((number, index) => {
                        return (
                          <Select.Option key={index + 1} value={number.toString()}>
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
        <Grid.Container mt={2} wrap="wrap" justify="center" gap={3}>
          {activityAr != [] &&
          activityAr != undefined &&
          (showActivities || showPlaces) ? (
            activityAr.map((activity, index) => {
              var dateSelector;
              if(activity.activitySegment != undefined){
                dateSelector =new Date(
                  parseInt(activity.activitySegment.duration.startTimestampMs)
                );
              }
              else{
                dateSelector =new Date(
                  parseInt(activity.placeVisit.duration.startTimestampMs)
                );
              }
              if(dateSelector.getDate() === selectedDate || selectedDate === 0){
                if (activity.activitySegment != undefined && showActivities) {
                  var segment = activity.activitySegment;
                  var type = activities.find(
                    (activity) => activity.kode == segment.activityType
                  );
                  var startdate = new Date(
                    parseInt(segment.duration.startTimestampMs)
                  );
                  var starttid = startdate.toLocaleTimeString();
  
                  var sluttid = new Date(
                    parseInt(segment.duration.endTimestampMs)
                  ).toLocaleTimeString();
                  return (
                    <Grid
                      style={{ minWidth: "180px" }}
                      key={index}
                      xs={6}
                      sm={6}
                      md={6}
                      lg={6}
                    >
                      <Card width="100%">
                        <Grid.Container direction="row" gap={2}>
                          <Grid>
                            <Description
                              title="Aktivitet"
                              content={
                                type === undefined
                                  ? segment.activityType
                                  : type.dk
                              }
                            />
                          </Grid>
                          <Grid>
                            <Description
                              title="Distance"
                              content={segment.distance + "m"}
                            />
                          </Grid>
  
                          <Grid>
                            <Description
                              title="Starttidspunkt"
                              content={starttid}
                            />
                          </Grid>
                          <Grid>
                            <Description
                              title="Sluttidspunkt"
                              content={sluttid}
                            />
                          </Grid>
                          <Grid>
                            <Description
                              title="Dato"
                              content={startdate.toLocaleDateString()}
                            />
                          </Grid>
                        </Grid.Container>
                      </Card>
                    </Grid>
                  );
                } else if (showPlaces && activity.placeVisit != undefined) {
                  var place = activity.placeVisit;
                  var startdate = new Date(
                    parseInt(place.duration.startTimestampMs)
                  );
                  var starttid = startdate.toLocaleTimeString();
                  var sluttid = new Date(
                    parseInt(place.duration.endTimestampMs)
                  ).toLocaleTimeString();
                  return (
                    <Grid style={{ minWidth: "180px" }} key={index} xs={6}>
                      <Card width="100%">
                        <Card.Content>
                          <Grid.Container direction="row" gap={2}>
                            <Grid>
                              <Description
                                title="Sted"
                                content={place.location.name}
                              />
                            </Grid>
                            <Grid>
                              <Description
                                title="Addresse"
                                content={place.location.address}
                              />
                            </Grid>
                            <Grid>
                              <Description
                                title="Sikkerhed"
                                content={
                                  parseInt(place.location.locationConfidence) +
                                  "%"
                                }
                              />
                            </Grid>
                            <Grid>
                              <Description
                                title="Starttidspunkt"
                                content={starttid}
                              />
                            </Grid>
                            <Grid>
                              <Description
                                title="Sluttidspunkt"
                                content={sluttid}
                              />
                            </Grid>
                            <Grid>
                              <Description
                                title="Dato"
                                content={startdate.toLocaleDateString()}
                              />
                            </Grid>
                            {place.location.semanticType != undefined ? (
                              <Grid>
                                <Description
                                  title="Type"
                                  content={
                                    place.location.semanticType === "TYPE_HOME"
                                      ? "Hjem"
                                      : place.location.semanticType
                                  }
                                />
                              </Grid>
                            ) : null}
                          </Grid.Container>
                        </Card.Content>
                      </Card>
                    </Grid>
                  );
                }
              }
            })
          ) : (
            <Text h3>Slå et filter fra for at vise nogle aktiviteter.</Text>
          )}
        </Grid.Container>
      </Page>
    </>
  );
}
