import { closeSnackbar, enqueueSnackbar } from "notistack";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function paginate(list = [], show) {
  return Array.from({ length: Math.ceil(list.length / show) }, (value, index) =>
    list.slice(index * show, index * show + show)
  );
}

export function snackbar(msg, variant, duration) {
  enqueueSnackbar(msg, {
    variant: variant,
    autoHideDuration: duration,
    action: (snackbarId) => (
      <IconButton color="white" onClick={() => closeSnackbar(snackbarId)}>
        <CloseIcon />
      </IconButton>
    ),
  });
}
