import styled from "styled-components";
import PropTypes from "prop-types";

const FrameWrap = styled.div`
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

  @media (max-width: 768px) {
    right: 0;
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

export const MapInfoPanel = ({
  metadata,
  token,
  isMinimapShown,
  showFullInfo,
}) => {
  const getIframeStyles = (showFullInfo) => ({
    display: showFullInfo ? "block" : "none",
    transition: "linear 0.5s",
    marginTop: showFullInfo ? "0" : "-540px",
    overflowX: showFullInfo ? "auto" : "none",
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

  return (
    <FrameWrap isMinimapShown={isMinimapShown}>
      <iframe
        id="tileset-info"
        title="tileset-info"
        // @ts-expect-error
        style={getIframeStyles(showFullInfo)}
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
