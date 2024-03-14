import styled from "styled-components";
import DarkMap from "../../../../public/icons/dark-map.png";
import LightMap from "../../../../public/icons/light-map.png";
import TerrainMap from "../../../../public/icons/terrain-map.png";
import CustomMap from "../../../../public/icons/custom-map.svg";

interface BaseMapIconProps {
  baseMapId: string;
}

const MapIcon = styled.div`
  background: #232430;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapIconWithBackground = styled(MapIcon)<{ url: string }>`
  background: url(${(props) => props.url}) no-repeat center #232430;
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

export const BaseMapIcon = ({ baseMapId }: BaseMapIconProps) => {
  switch (baseMapId) {
    case "Dark":
      return <MapIconWithBackground url={DarkMap} />;
    case "Light":
      return <MapIconWithBackground url={LightMap} />;
    case "Terrain":
      return <MapIconWithBackground url={TerrainMap} />;
    default:
      return (
        <MapIcon>
          <CustomMap />
        </MapIcon>
      );
  }
};
