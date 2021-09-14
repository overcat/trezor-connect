/* eslint-disable import/no-unresolved, import/no-webpack-loader-syntax */
import SharedConnectionWorker from 'sharedworker-loader?name=workers/shared-connection-worker.[hash].js!../../../../trezor-link/lib/lowlevel/sharedConnectionWorker';
import BlockbookWorker from 'worker-loader?filename=workers/blockbook-worker.[hash].js!@trezor/blockchain-link/lib/workers/blockbook/index.js';
import RippleWorker from 'worker-loader?filename=workers/ripple-worker.[hash].js!@trezor/blockchain-link/lib/workers/ripple/index.js';

import TrezorLink from 'trezor-link/lib';

const WebUsbPlugin = () =>
    new TrezorLink.Lowlevel(
        new TrezorLink.WebUsb(),
        typeof SharedWorker !== 'undefined' ? () => new SharedConnectionWorker() : null,
    );

const ReactNativeUsbPlugin = undefined;

export { WebUsbPlugin, ReactNativeUsbPlugin, BlockbookWorker, RippleWorker };
