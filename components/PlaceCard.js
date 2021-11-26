import { Card, Description, Grid } from "@geist-ui/react";
const PlaceCard = (props) => {
  const place = props.place;
  var startdate = new Date(parseInt(place.duration.startTimestampMs));
  var starttid = startdate.toLocaleTimeString();
  var sluttid = new Date(
    parseInt(place.duration.endTimestampMs)
  ).toLocaleTimeString();
  return (
    <Grid style={{ minWidth: "180px" }} xs={6}>
      <Card width="100%">
        <Card.Content>
          <Grid.Container direction="row" gap={2}>
            <Grid>
              <Description title="Sted" content={place.location.name} />
            </Grid>
            <Grid>
              <Description title="Addresse" content={place.location.address} />
            </Grid>
            <Grid>
              <Description
                title="Sikkerhed"
                content={parseInt(place.location.locationConfidence) + "%"}
              />
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
};

export default PlaceCard;
