import * as React from 'react';

import { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';

import { MatchDto, MatchesClient } from '../../api/client';
import Error from '../Error';
import Loading from '../Loading';

const styles = (theme: Theme) => ({
  add: {
    position: 'fixed' as 'fixed',

    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

interface IProps extends WithStyles<typeof styles> {
  onAddedHandler: () => void;
}

interface IState {
  dialogOpen: boolean;
  error: boolean;
  loading: boolean;

  player1: string;
  player2: string;
  startTime: string;
}

class AddMatch extends React.Component<IProps, IState> {
  private client = new MatchesClient();

  constructor(props: any) {
    super(props);

    this.state = {
      dialogOpen: false,
      error: false,
      loading: false,
      player1: '',
      player2: '',
      startTime: new Date().toISOString().substring(0, 16)
    };
  }

  public render() {
    return (
      <React.Fragment>
        {this.state.error && <Error message="Error while adding match." />}

        <Tooltip title="Add Match">
          <Button
            variant="fab"
            color="primary"
            className={this.props.classes.add}
            onClick={this.openDialog}
          >
            <AddIcon />
          </Button>
        </Tooltip>

        <Dialog
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Match</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus={true}
              margin="dense"
              name="player1"
              label="Player 1"
              required={true}
              fullWidth={true}
              value={this.state.player1}
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              margin="dense"
              name="player2"
              label="Player 2"
              required={true}
              fullWidth={true}
              value={this.state.player2}
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              margin="dense"
              name="startTime"
              label="Start Time"
              type="datetime-local"
              required={true}
              fullWidth={true}
              value={this.state.startTime}
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </DialogContent>
          <DialogActions>
            {this.state.loading && <Loading />}
            <Button onClick={this.closeDialog} color="default">
              Cancel
            </Button>
            <Button onClick={this.addMatch} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  private openDialog = () => {
    this.setState({ dialogOpen: true });
  };

  private closeDialog = () => {
    this.setState({ dialogOpen: false });
  };

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  private addMatch = () => {
    this.setState({ loading: true, error: false });

    const dto = new MatchDto();
    dto.player1 = this.state.player1;
    dto.player2 = this.state.player2;
    dto.startTime = new Date(this.state.startTime);

    this.client
      .create(dto)
      .then(() => {
        this.setState(
          {
            loading: false,
            player1: '',
            player2: ''
          },
          () => {
            this.closeDialog();

            if (this.props.onAddedHandler != null) {
              this.props.onAddedHandler();
            }
          }
        );
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  };
}

export default withStyles(styles)(AddMatch);
