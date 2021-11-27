import { Button, Card, Description, Grid, Modal } from "@geist-ui/react";
import { useState } from "react";
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() =>
  import('react-leaflet').then((leaftlet) => leaftlet.MapContainer)
)

const Marker = dynamic(() =>
  import('react-leaflet').then((leaftlet) => leaftlet.Marker)
)


const TileLayer = dynamic(() =>
  import('react-leaflet').then((leaftlet) => leaftlet.TileLayer)
)

const Popup = dynamic(() =>
  import('react-leaflet').then((leaftlet) => leaftlet.Popup)
)
import MapPin from "@geist-ui/react-icons/mapPin";

const PlaceCard = (props) => {
  const [visible, setVisible] = useState(false);
  const place = props.place;
  var startdate = new Date(parseInt(place.duration.startTimestampMs));
  var starttid = startdate.toLocaleTimeString();
  var sluttid = new Date(
    parseInt(place.duration.endTimestampMs)
  ).toLocaleTimeString();
  var lat = place.location.latitudeE7 / 10000000;
  var long = place.location.longitudeE7 / 10000000;
  const closeHandler = (event) => {
    setVisible(false);
  };

  return (
    <>
      <Grid style={{ minWidth: "180px" }} xs={6}>
        <Card width="100%">
          <Card.Content>
            <Grid.Container direction="row" gap={2}>
              <Grid>
                <Description title="Sted" content={place.location.name} />
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
          <Card.Footer>
            <Button icon={<MapPin />} onClick={() => setVisible(true)}>
              View map
            </Button>
          </Card.Footer>
        </Card>
      </Grid>
      <Modal visible={visible} onClose={closeHandler}>
        <Modal.Title>Map View</Modal.Title>
        <Modal.Content>
          <div style={{ height: "400px", display: "flex" }}>
            <MapContainer
              style={{ flexGrow: 1, borderRadius: "5px" }}
              center={[lat, long]}
              zoom={16}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, long]}>
                <Popup>{place.location.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default PlaceCard;
