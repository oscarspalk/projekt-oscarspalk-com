import { Grid, Card, Description } from "@geist-ui/react";

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
const ActivityCard = (props) => {
  var segment = props.activity;
  var type = activities.find(
    (activity) => activity.kode == segment.activityType
  );
  var startdate = new Date(parseInt(segment.duration.startTimestampMs));
  var starttid = startdate.toLocaleTimeString();
  var sluttid = new Date(
    parseInt(segment.duration.endTimestampMs)
  ).toLocaleTimeString();
  return (
    <Grid style={{ minWidth: "180px" }} xs={6} sm={6} md={6} lg={6}>
      <Card width="100%">
        <Grid.Container direction="row" gap={2}>
          <Grid>
            <Description
              title="Aktivitet"
              content={type === undefined ? segment.activityType : type.dk}
            />
          </Grid>
          <Grid>
            <Description title="Distance" content={segment.distance + "m"} />
          </Grid>

          <Grid>
            <Description title="Starttidspunkt" content={starttid} />
          </Grid>
          <Grid>
            <Description title="Sluttidspunkt" content={sluttid} />
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
};

export default ActivityCard;
