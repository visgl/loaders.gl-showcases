import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

/* eslint-disable-next-line */
export interface LoadingProps {}

export function Loading(props: LoadingProps) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Loading;
