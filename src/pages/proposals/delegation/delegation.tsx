import { useState } from 'react';
import { abbrStr } from '../../../chain-data/helpers';
import DelegateVotesForm from '../forms/delegate/delegate-form';
import globalStyles from '../../../styles/global-styles.module.scss';
import { useChainData } from '../../../chain-data';
import styles from './delegation.module.scss';
import Button from '../../../components/button/button';
import { Modal } from '../../../components/modal/modal';
import { delegationCooldownOverSelector } from '../../../logic/proposals/selectors';
import ChooseDelegateAction from '../forms/choose-delegate-action/choose-delegate-action';
import { useApi3Pool } from '../../../contracts';
import { go, isUserRejection } from '../../../utils';
import * as notifications from '../../../components/notifications/notifications';
import { messages } from '../../../utils/messages';
import { useLoadDashboardData } from '../../../logic/dashboard';

const Delegation = () => {
  // TODO: Retrieve only "userStaked" from the chain instead of loading all staking data (and remove useLoadDashboardData call)
  const { delegation, dashboardState, setChainData, transactions, userAccount } = useChainData();
  const api3Pool = useApi3Pool();

  useLoadDashboardData();

  const [openDelegationModal, setOpenDelegationModal] = useState(false);
  const [openChooseDelegateActionModal, setOpenChooseDelegateActionModal] = useState(false);

  // TODO: Merge into bigger selector
  const delegationCooldownOver = delegationCooldownOverSelector(delegation);
  const canDelegate = delegationCooldownOver && (dashboardState?.userStaked.gt(0) ?? false);
  const canUndelegate = delegationCooldownOver;

  return (
    <>
      {delegation?.delegate ? (
        <div>
          <p className={`${globalStyles.secondaryColor} ${globalStyles.bold}`} data-cy="delegated-to">
            Delegated to: {abbrStr(delegation.delegate)}
          </p>
          <Button
            className={styles.proposalsLink}
            type="text"
            onClick={() => setOpenChooseDelegateActionModal(true)}
            disabled={!canDelegate && !canUndelegate}
          >
            Update delegation
          </Button>
          <Modal open={openChooseDelegateActionModal} onClose={() => setOpenChooseDelegateActionModal(false)}>
            <ChooseDelegateAction
              canUpdateDelegation={canDelegate}
              canUndelegate={canUndelegate}
              onUndelegate={async () => {
                if (!api3Pool) return;

                const [error, tx] = await go(api3Pool.undelegateVotingPower());
                if (error) {
                  if (isUserRejection(error)) {
                    notifications.info({ message: messages.TX_GENERIC_REJECTED });
                    return;
                  }
                  notifications.error({ message: messages.TX_GENERIC_ERROR, errorOrMessage: error });
                  return;
                }

                if (tx) {
                  setChainData('Save undelegate transaction', {
                    transactions: [...transactions, { type: 'undelegate', tx }],
                  });
                }

                setOpenChooseDelegateActionModal(false);
              }}
              onUpdateDelegation={() => {
                setOpenChooseDelegateActionModal(false);
                setOpenDelegationModal(true);
              }}
            />
          </Modal>
        </div>
      ) : (
        <div>
          <p className={`${globalStyles.secondaryColor} ${globalStyles.bold}`}>Undelegated</p>
          <Button
            className={styles.proposalsLink}
            type="text"
            onClick={() => setOpenDelegationModal(true)}
            disabled={!canDelegate}
          >
            Delegate
          </Button>
        </div>
      )}
      <Modal open={openDelegationModal} onClose={() => setOpenDelegationModal(false)}>
        <DelegateVotesForm onClose={() => setOpenDelegationModal(false)} userAccount={userAccount} />
      </Modal>
    </>
  );
};

export default Delegation;
