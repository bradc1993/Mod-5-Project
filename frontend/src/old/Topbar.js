import React, { useState } from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar } from "@material-ui/core";
import { useEditor } from "@craftjs/core";
import { makeStyles } from '@material-ui/core/styles';
import lz from "lzutf8";
import copy from 'copy-to-clipboard';

const useStyles = makeStyles({
    root: {
        color: 'rgb(240, 245, 243)',
        borderColor: 'rgb(240, 245, 243)',
        margin:'0 10px'
    }
})

export const Topbar = () => {
    const { actions, query, enabled } = useEditor((state) => ({
        enabled: state.options.enabled
    }));

    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState();
    const [stateToLoad, setStateToLoad] = useState();

    const classes = useStyles();

    const saveTemplate = () => {
        const json = query.serialize();
        const identifier = lz.encodeBase64(lz.compress(json));
        const user = sessionStorage.getItem('user');

        fetch(`http://localhost:3000/templates`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                identifier: identifier,
                user_id: user.id
            })
        }).then(res => res.json()).then(res => console.log(res))
    }

    return (
        <Box px={1} py={1} mt={0} mb={3} bgcolor="#1B1B1B">
            <Grid container alignItems="center">
                <Grid item xs>
                    {/* <FormControlLabel
                        className="enable-disable-toggle"
                        control={<Switch checked={enabled} onChange={(_, value) => actions.setOptions(options => options.enabled = value)} />}
                        label="Enable"
                    /> */}
                    <h3 style={{ color: '#F0F5F3', marginLeft: '10px' }}>BRAVURA.</h3>
                </Grid>
                <Grid item>
                    <MaterialButton
                        className={classes.root}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => saveTemplate()}
                    >
                        Save
          </MaterialButton>
                    <MaterialButton
                        className={classes.root}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => setDialogOpen(true)}
                    >
                        Load
          </MaterialButton>
                    <Dialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle id="alert-dialog-title">Load state</DialogTitle>
                        <DialogContent>
                            <TextField
                                multiline
                                fullWidth
                                placeholder='Paste the contents that was copied from the "Copy Current State" button'
                                size="small"
                                value={stateToLoad}
                                onChange={e => setStateToLoad(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <MaterialButton onClick={() => setDialogOpen(false)} color="primary">
                                Cancel
              </MaterialButton>
                            <MaterialButton
                                onClick={() => {
                                    setDialogOpen(false);
                                    const json = lz.decompress(lz.decodeBase64(stateToLoad));
                                    actions.deserialize(json);
                                    setSnackbarMessage("State loaded")
                                }}
                                color="primary"
                                autoFocus
                            >
                                Load
              </MaterialButton>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        autoHideDuration={1000}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        open={!!snackbarMessage}
                        onClose={() => setSnackbarMessage(null)}
                        message={<span>{snackbarMessage}</span>}
                    />
                </Grid>
            </Grid>
        </Box>
    )
};