import React, { useCallback, useContext, useState } from 'react';
import {
  PlatformStateContext,
  AccountStorageMutation,
  AccountStorageQuery,
  Button,
  EmptyState,
  HeadingText,
  Modal,
  Spinner
} from 'nr1';
import StatColumn from './StatColumn';
import Funnel from '../components/funnel';
import NewJourney from '../components/new-journey/new-journey';
import AccountPicker from '../components/account-picker';

const CUSTOMER_JOURNEY_CONFIGS = 'CUSTOMER_JOURNEY_CONFIGS';

// Height of one funnel step, matched to a StatCell plus the gap below it so the
// funnel rows line up with the stat rows next to it.
const FUNNEL_STEP_HEIGHT = 160;
const funnelHeight = numberOfSteps => numberOfSteps * FUNNEL_STEP_HEIGHT + 6;

const CustomerJourney = () => {
  const platformUrlState = useContext(PlatformStateContext);
  const [selectedAccountId, setSelectedAccountId] = useState();
  const [journeys, setJourneys] = useState([]);
  const [currentJourney, setCurrentJourney] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [journeyToBeEdited, setJourneyToBeEdited] = useState();
  const [journeyToBeDeleted, setJourneyToBeDeleted] = useState();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadJourneys = useCallback(async accountId => {
    setIsProcessing(true);
    const { data } = await AccountStorageQuery.query({
      accountId,
      collection: CUSTOMER_JOURNEY_CONFIGS
    });
    const loaded = data || [];
    setJourneys(loaded);
    setIsProcessing(false);
    return loaded;
  }, []);

  const handleAccountSelect = useCallback(
    async accountId => {
      setSelectedAccountId(accountId);
      const loaded = await loadJourneys(accountId);
      setCurrentJourney(loaded.length > 0 ? loaded[0].id : undefined);
    },
    [loadJourneys]
  );

  const handleFormOpen = () => setIsFormOpen(true);

  const handleCancel = () => {
    setIsFormOpen(false);
    setJourneyToBeEdited(undefined);
  };

  const handleOnEdit = journey => {
    setJourneyToBeEdited(journey);
    setIsFormOpen(true);
  };

  const handleOnSave = async journey => {
    setIsSaving(true);

    const document = {
      ...journey,
      accountId: selectedAccountId,
      id: journey.id || crypto.randomUUID()
    };

    await AccountStorageMutation.mutate({
      accountId: selectedAccountId,
      actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: CUSTOMER_JOURNEY_CONFIGS,
      documentId: document.id,
      document
    });

    setIsFormOpen(false);
    setJourneyToBeEdited(undefined);
    await loadJourneys(selectedAccountId);
    setIsSaving(false);
    setCurrentJourney(document.id);
  };

  const deleteJourney = async () => {
    setIsDeleting(true);

    await AccountStorageMutation.mutate({
      accountId: selectedAccountId,
      actionType: AccountStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
      collection: CUSTOMER_JOURNEY_CONFIGS,
      documentId: journeyToBeDeleted.id
    });

    setJourneyToBeDeleted(undefined);
    setIsDeleting(false);
    const loaded = await loadJourneys(selectedAccountId);
    setCurrentJourney(loaded.length > 0 ? loaded[0].id : undefined);
  };

  const journey = journeys.find(({ id }) => id === currentJourney)?.document;

  let mainContainerStyle = 'main-container';
  let content = null;
  if (isProcessing) {
    content = <Spinner />;
  } else if (isFormOpen) {
    mainContainerStyle = `${mainContainerStyle} main-container--form-open`;
    content = (
      <NewJourney
        isSaving={isSaving}
        handleCancel={handleCancel}
        handleOnSave={handleOnSave}
        journey={journeyToBeEdited}
      />
    );
  } else if (journeys.length === 0) {
    content = (
      <EmptyState
        fullHeight
        fullWidth
        title="No Journeys configured"
        description="It looks like no Journeys have been defined. To get started,
          define a Journey using the button below and follow the instructions."
        action={{ label: 'Add new Journey', onClick: handleFormOpen }}
      />
    );
  } else if (!journey) {
    content = (
      <EmptyState
        fullHeight
        fullWidth
        title="No Journey selected"
        description="Select Journey from left panel to get started."
      />
    );
  }

  return (
    <div className="customer-journey">
      <div className="customer-journey__toolbar">
        <div>
          <AccountPicker accountChangedCallback={handleAccountSelect} />
        </div>
        {!isFormOpen && (
          <Button
            onClick={handleFormOpen}
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
                    onClick={() => setCurrentJourney(id)}
                  >
                    <p className="list__journey-title">{title}</p>
                    <div>
                      <Button
                        className="edit-button"
                        sizeType={Button.SIZE_TYPE.SMALL}
                        type={Button.TYPE.NORMAL}
                        onClick={e => {
                          e.stopPropagation();
                          handleOnEdit(document);
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
                          setJourneyToBeDeleted(document);
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
          hidden={!journeyToBeDeleted}
          onClose={() => setJourneyToBeDeleted(undefined)}
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
            onClick={() => setJourneyToBeDeleted(undefined)}
          >
            Cancel
          </Button>
          <Button
            spacingType={[Button.SPACING_TYPE.MEDIUM]}
            type={Button.TYPE.DESTRUCTIVE}
            onClick={deleteJourney}
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__TRASH}
            loading={isDeleting}
          >
            Delete
          </Button>
        </Modal>
        {content || (
          <div className="journey-container">
            <div className="customerJourneyContent">
              <div className="visualizationContainer">
                <h3 className="columnHeader">Click Rate</h3>
                <div
                  className="statCell visualizationCell"
                  style={{ height: funnelHeight(journey.steps.length) }}
                >
                  <Funnel
                    accountId={journey.accountId}
                    funnel={journey.funnel}
                    steps={journey.steps}
                    series={journey.series}
                    platformUrlState={platformUrlState}
                  />
                </div>
              </div>
              {journey.series.map((series, i) => (
                <StatColumn
                  key={i}
                  column={series}
                  config={journey}
                  platformUrlState={platformUrlState}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerJourney;
