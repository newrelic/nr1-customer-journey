import React from 'react';
import {
  PlatformStateContext,
  AccountStorageMutation,
  AccountStorageQuery,
  Button,
  HeadingText,
  Modal,
  Spinner
} from 'nr1';
import StatColumn from './StatColumn';
import { FunnelComponent } from 'nr1-funnel-component';
import NewJourney from '../components/new-journey/new-journey';
import AccountPicker from '../components/account-picker';
import { v4 as uuidv4 } from 'uuid';

const CUSTOMER_JOURNEY_CONFIGS = 'CUSTOMER_JOURNEY_CONFIGS';

export default class Wrapper extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFormOpen: false,
      selectedAccountId: undefined,
      journeys: [],
      currentJourney: undefined,
      isDeleteJourneyActive: false,
      journeyToBeDeleted: undefined,
      isProcessing: true,
      isDeleting: false,
      isSaving: false
    };
  }

  renderStepsClass(journey) {
    const numberOfSteps = journey.steps.length;

    if (numberOfSteps === 1) {
      return 'one-step-visualization';
    } else if (numberOfSteps === 2) {
      return 'two-step-visualization';
    } else if (numberOfSteps === 3) {
      return 'three-step-visualization';
    } else if (numberOfSteps === 5) {
      return 'five-step-visualization';
    } else if (numberOfSteps === 6) {
      return 'six-step-visualization';
    } else if (numberOfSteps === 7) {
      return 'seven-step-visualization';
    } else if (numberOfSteps === 8) {
      return 'eight-step-visualization';
    } else if (numberOfSteps === 9) {
      return 'nine-step-visualization';
    } else if (numberOfSteps === 10) {
      return 'ten-step-visualization';
    } else {
      return '';
    }
  }

  loadData = async () => {
    this.setState({
      isProcessing: true
    });

    const { selectedAccountId } = this.state;
    const { data } = await AccountStorageQuery.query({
      accountId: selectedAccountId,
      collection: CUSTOMER_JOURNEY_CONFIGS
    });

    this.setState({
      isProcessing: false,
      journeys: data
    });
  };

  handleAccountSelect = async accountId => {
    this.setState(
      {
        selectedAccountId: accountId
      },
      async () => {
        await this.loadData();
        this.setState(({ journeys }) => ({
          currentJourney: journeys.length > 0 ? journeys[0].id : undefined
        }));
      }
    );
  };

  handleFormOpen = () => {
    this.setState({ isFormOpen: true });
  };

  handleOnSave = async journey => {
    this.setState({ isSaving: true });

    const { selectedAccountId } = this.state;

    journey.accountId = selectedAccountId;
    if (!journey.id) {
      journey.id = uuidv4();
    }

    await AccountStorageMutation.mutate({
      accountId: selectedAccountId,
      actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: CUSTOMER_JOURNEY_CONFIGS,
      documentId: journey.id,
      document: journey
    });

    this.setState({
      isFormOpen: false,
      journeyToBeEdited: undefined,
      currentJourney: null
    });

    await this.loadData();

    this.setState({
      isSaving: false,
      currentJourney: journey.id
    });
  };

  handleJourneyChange = selectedJourney => {
    this.setState(
      {
        currentJourney: null
      },
      () => {
        this.setState({
          currentJourney: selectedJourney
        });
      }
    );
  };

  handleOnEdit = journey => {
    this.setState({
      journeyToBeEdited: journey,
      isFormOpen: true
    });
  };

  handleCancel = () => {
    this.setState({ isFormOpen: false, journeyToBeEdited: undefined });
  };

  handleOnDelete = document => {
    this.setState({
      isDeleteJourneyActive: true,
      journeyToBeDeleted: document
    });
  };

  deleteJourney = async () => {
    this.setState({
      isDeleting: true
    });

    const { journeyToBeDeleted } = this.state;

    await AccountStorageMutation.mutate({
      documentId: journeyToBeDeleted.id,
      accountId: 1606862,
      collection: CUSTOMER_JOURNEY_CONFIGS,
      actionType: AccountStorageMutation.ACTION_TYPE.DELETE_DOCUMENT
    });

    this.setState({
      isDeleteJourneyActive: false,
      journeyToBeDeleted: undefined,
      isDeleting: false,
      currentJourney: undefined
    });

    await this.loadData();

    this.setState(prevState => ({
      currentJourney:
        prevState.journeys.length > 0 ? prevState.journeys[0].id : undefined
    }));
  };

  render() {
    const {
      isFormOpen,
      journeys,
      currentJourney,
      journeyToBeEdited,
      isDeleteJourneyActive,
      isProcessing,
      isDeleting,
      isSaving
    } = this.state;

    const journey = journeys.find(journey => journey.id === currentJourney)
      ?.document;

    let mainContainerStyle = 'main-container';

    if (isFormOpen) {
      mainContainerStyle = `${mainContainerStyle} main-container--form-open`;
    }

    return (
      <div className="customer-journey">
        <div className="customer-journey__toolbar">
          <div>
            <AccountPicker accountChangedCallback={this.handleAccountSelect} />
          </div>
          {!isFormOpen && (
            <Button
              onClick={this.handleFormOpen}
              type={Button.TYPE.PRIMARY}
              iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__NOTES__A_ADD}
            >
              Add new Journey
            </Button>
          )}
        </div>
        <div className={mainContainerStyle}>
          {isFormOpen ? null : (
            <div className="left-sidebar">
              <HeadingText
                className="left-sidebar__heading"
                type={HeadingText.TYPE.HEADING_3}
              >
                JOURNEYS
              </HeadingText>
              <ul className="left-sidebar__list">
                {isProcessing ? (
                  <Spinner />
                ) : (
                  journeys.map(({ id, document, document: { title } }) => (
                    <li
                      className={`list__item ${
                        currentJourney === id ? 'list__item--active' : ''
                      }`}
                      key={id}
                      onClick={() => this.handleJourneyChange(id)}
                    >
                      <p className="list__journey-title">{title}</p>
                      <div>
                        <Button
                          className="edit-button"
                          sizeType={Button.SIZE_TYPE.SMALL}
                          type={Button.TYPE.NORMAL}
                          onClick={e => {
                            e.stopPropagation();
                            this.handleOnEdit(document);
                          }}
                        >
                          EDIT
                        </Button>
                        <Button
                          className="delete-button"
                          sizeType={Button.SIZE_TYPE.SMALL}
                          type={Button.TYPE.DESTRUCTIVE}
                          onClick={e => {
                            e.stopPropagation();
                            this.handleOnDelete(document);
                          }}
                        >
                          DELETE
                        </Button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
          <Modal
            hidden={!isDeleteJourneyActive}
            onClose={() => this.setState({ isDeleteJourneyActive: false })}
          >
            <HeadingText type={HeadingText.TYPE.HEADING_2}>
              Are you sure you want to delete this Journey?
            </HeadingText>
            <p>
              This cannot be undone. Please confirm whether or not you want to
              delete this Journey.
            </p>
            <Button
              spacingType={[
                Button.SPACING_TYPE.MEDIUM,
                Button.SPACING_TYPE.OMIT,
                Button.SPACING_TYPE.MEDIUM
              ]}
              type={Button.TYPE.PRIMARY}
              onClick={() =>
                this.setState({
                  isDeleteJourneyActive: false,
                  journeyToBeDeleted: undefined
                })
              }
            >
              Cancel
            </Button>
            <Button
              spacingType={[Button.SPACING_TYPE.MEDIUM]}
              type={Button.TYPE.DESTRUCTIVE}
              onClick={this.deleteJourney}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__TRASH}
              loading={isDeleting}
            >
              Delete
            </Button>
          </Modal>
          <PlatformStateContext.Consumer>
            {platformUrlState =>
              isFormOpen ? (
                <NewJourney
                  isSaving={isSaving}
                  handleCancel={this.handleCancel}
                  handleOnSave={this.handleOnSave}
                  journey={journeyToBeEdited}
                />
              ) : (
                journey && (
                  <div className="journey-container">
                    <div className="customerJourneyContent">
                      <div className="visualizationContainer">
                        <h3 className="columnHeader">Click Rate</h3>
                        <div
                          className={`statCell visualizationCell ${this.renderStepsClass(
                            journey
                          )}`}
                        >
                          <FunnelComponent
                            launcherUrlState={platformUrlState}
                            {...journey}
                          />
                        </div>
                      </div>
                      {journey.series.map((series, i) => {
                        return (
                          <StatColumn
                            key={i}
                            column={series}
                            config={journey}
                            platformUrlState={platformUrlState}
                          />
                        );
                      })}
                    </div>
                  </div>
                )
              )
            }
          </PlatformStateContext.Consumer>
        </div>
      </div>
    );
  }
}
