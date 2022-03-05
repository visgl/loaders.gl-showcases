import styled from "styled-components";
import PropTypes from "prop-types";
import { Property } from "csstype";

const FrameWrap = styled.div<{ isMinimapShown: boolean }>`
  position: absolute;
  right: 1%;
  height: calc(75% - 85px);
  max-height: 500px;
  bottom: 22%;
  z-index: 3;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  background: white;
  border: 8px solid black;
  border-radius: 8px;
  overflow-y: auto;
  overflow-x: hidden;

  iframe {
    overflow-x: hidden;
    height: 90% !important;
    width: 310px;
  }
`;

const ArcGisContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const propTypes = {
  showFullInfo: PropTypes.bool,
  name: PropTypes.string,
  tileset: PropTypes.object,
  metadata: PropTypes.object,
  token: PropTypes.string,
};

const defaultProps = {
  showFullInfo: false,
};

/**
 * TODO: Add types to component
 */
export const MapInfoPanel = ({
  metadata,
  token,
  isMinimapShown,
  showFullInfo,
}) => {
  const getIframeStyles = (
    showFullInfo
  ): {
    display: string;
    transition: string;
    marginTop: string;
    overflowX: Property.OverflowX;
    border: string;
  } => ({
    display: showFullInfo ? "block" : "none",
    transition: "linear 0.5s",
    marginTop: showFullInfo ? "0" : "-540px",
    overflowX: showFullInfo ? "auto" : "hidden",
    border: "none",
  });

  const serviceItemId = metadata?.serviceItemId;

  if (!serviceItemId) {
    return null;
  }

  let url = `https://www.arcgis.com/home/item.html?id=${serviceItemId}`;
  if (token) {
    url = `${url}&token=${token}`;
  }
  const iframeStyle = getIframeStyles(showFullInfo);

  return (
    <FrameWrap id="map-info-panel" isMinimapShown={isMinimapShown}>
      <iframe
        id="tileset-info"
        title="tileset-info"
        style={iframeStyle}
        src={url}
      ></iframe>
      <ArcGisContainer>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.arcgis.com/home/item.html?id=${serviceItemId}`}
        >
          Go to ArcGiS
        </a>
      </ArcGisContainer>
    </FrameWrap>
  );
};

MapInfoPanel.propTypes = propTypes;
MapInfoPanel.defaultProps = defaultProps;
