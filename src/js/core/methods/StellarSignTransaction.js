/* @flow */

import AbstractMethod from './AbstractMethod';
import { validateParams, getFirmwareRange } from './helpers/paramsValidator';
import { getMiscNetwork } from '../../data/CoinInfo';
import { validatePath } from '../../utils/pathUtils';
import * as helper from './helpers/stellarSignTx';

import type { CoreMessage, StellarTransaction } from '../../types';

const StellarSupportOperations = Object.freeze({
    StellarAccountMergeOp: ['1.10.4', '2.4.3'],
    StellarAllowTrustOp: ['1.10.4', '2.4.3'],
    StellarBumpSequenceOp: ['1.10.4', '2.4.3'],
    StellarChangeTrustOp: ['1.10.4', '2.4.3'],
    StellarCreateAccountOp: ['1.10.4', '2.4.3'],
    StellarCreatePassiveSellOfferOp: ['1.10.4', '2.4.3'],
    StellarManageDataOp: ['1.10.4', '2.4.3'],
    StellarManageBuyOfferOp: ['1.10.4', '2.4.3'],
    StellarManageSellOfferOp: ['1.10.4', '2.4.3'],
    StellarPathPaymentStrictReceiveOp: ['1.10.4', '2.4.3'],
    StellarPathPaymentStrictSendOp: ['1.10.4', '2.4.3'],
    StellarPaymentOp: ['1.10.4', '2.4.3'],
    StellarSetOptionsOp: ['1.10.4', '2.4.3'],
});

type Params = {
    path: number[],
    networkPassphrase: string,
    transaction: StellarTransaction,
};

export default class StellarSignTransaction extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);
        this.requiredPermissions = ['read', 'write'];
        this.firmwareRange = getFirmwareRange(
            this.name,
            getMiscNetwork('Stellar'),
            this.firmwareRange,
        );
        this.info = 'Sign Stellar transaction';

        const { payload } = message;
        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', obligatory: true },
            { name: 'networkPassphrase', type: 'string', obligatory: true },
            { name: 'transaction', obligatory: true },
        ]);

        const path = validatePath(payload.path, 3);
        // incoming data should be in stellar-sdk format
        const { transaction } = payload;
        this.params = {
            path,
            networkPassphrase: payload.networkPassphrase,
            transaction,
        };
    }

    async run() {
        const response = await helper.stellarSignTx(
            this.device.getCommands().typedCall.bind(this.device.getCommands()),
            this.params.path,
            this.params.networkPassphrase,
            this.params.transaction,
        );

        return {
            publicKey: response.public_key,
            signature: response.signature,
        };
    }
}
