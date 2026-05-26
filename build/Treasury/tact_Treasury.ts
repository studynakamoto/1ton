import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type Buy = {
    $$type: 'Buy';
    queryId: bigint;
    minTokensOut: bigint;
}

export function storeBuy(src: Buy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1422049996, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.minTokensOut);
    };
}

export function loadBuy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1422049996) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _minTokensOut = sc_0.loadCoins();
    return { $$type: 'Buy' as const, queryId: _queryId, minTokensOut: _minTokensOut };
}

export function loadTupleBuy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _minTokensOut = source.readBigNumber();
    return { $$type: 'Buy' as const, queryId: _queryId, minTokensOut: _minTokensOut };
}

export function loadGetterTupleBuy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _minTokensOut = source.readBigNumber();
    return { $$type: 'Buy' as const, queryId: _queryId, minTokensOut: _minTokensOut };
}

export function storeTupleBuy(source: Buy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.minTokensOut);
    return builder.build();
}

export function dictValueParserBuy(): DictionaryValue<Buy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuy(src)).endCell());
        },
        parse: (src) => {
            return loadBuy(src.loadRef().beginParse());
        }
    }
}

export type LaunchToken = {
    $$type: 'LaunchToken';
    queryId: bigint;
    name: string;
    symbol: string;
    description: string;
    imageUrl: string;
}

export function storeLaunchToken(src: LaunchToken) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3373264781, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.symbol);
        const b_1 = new Builder();
        b_1.storeStringRefTail(src.description);
        b_1.storeStringRefTail(src.imageUrl);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadLaunchToken(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3373264781) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _name = sc_0.loadStringRefTail();
    const _symbol = sc_0.loadStringRefTail();
    const sc_1 = sc_0.loadRef().beginParse();
    const _description = sc_1.loadStringRefTail();
    const _imageUrl = sc_1.loadStringRefTail();
    return { $$type: 'LaunchToken' as const, queryId: _queryId, name: _name, symbol: _symbol, description: _description, imageUrl: _imageUrl };
}

export function loadTupleLaunchToken(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _name = source.readString();
    const _symbol = source.readString();
    const _description = source.readString();
    const _imageUrl = source.readString();
    return { $$type: 'LaunchToken' as const, queryId: _queryId, name: _name, symbol: _symbol, description: _description, imageUrl: _imageUrl };
}

export function loadGetterTupleLaunchToken(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _name = source.readString();
    const _symbol = source.readString();
    const _description = source.readString();
    const _imageUrl = source.readString();
    return { $$type: 'LaunchToken' as const, queryId: _queryId, name: _name, symbol: _symbol, description: _description, imageUrl: _imageUrl };
}

export function storeTupleLaunchToken(source: LaunchToken) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeString(source.name);
    builder.writeString(source.symbol);
    builder.writeString(source.description);
    builder.writeString(source.imageUrl);
    return builder.build();
}

export function dictValueParserLaunchToken(): DictionaryValue<LaunchToken> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLaunchToken(src)).endCell());
        },
        parse: (src) => {
            return loadLaunchToken(src.loadRef().beginParse());
        }
    }
}

export type TokenLaunched = {
    $$type: 'TokenLaunched';
    queryId: bigint;
    jettonMaster: Address;
    bondingCurve: Address;
    creator: Address;
    name: string;
    symbol: string;
}

export function storeTokenLaunched(src: TokenLaunched) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1839890722, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.jettonMaster);
        b_0.storeAddress(src.bondingCurve);
        b_0.storeAddress(src.creator);
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.symbol);
    };
}

export function loadTokenLaunched(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1839890722) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _jettonMaster = sc_0.loadAddress();
    const _bondingCurve = sc_0.loadAddress();
    const _creator = sc_0.loadAddress();
    const _name = sc_0.loadStringRefTail();
    const _symbol = sc_0.loadStringRefTail();
    return { $$type: 'TokenLaunched' as const, queryId: _queryId, jettonMaster: _jettonMaster, bondingCurve: _bondingCurve, creator: _creator, name: _name, symbol: _symbol };
}

export function loadTupleTokenLaunched(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _jettonMaster = source.readAddress();
    const _bondingCurve = source.readAddress();
    const _creator = source.readAddress();
    const _name = source.readString();
    const _symbol = source.readString();
    return { $$type: 'TokenLaunched' as const, queryId: _queryId, jettonMaster: _jettonMaster, bondingCurve: _bondingCurve, creator: _creator, name: _name, symbol: _symbol };
}

export function loadGetterTupleTokenLaunched(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _jettonMaster = source.readAddress();
    const _bondingCurve = source.readAddress();
    const _creator = source.readAddress();
    const _name = source.readString();
    const _symbol = source.readString();
    return { $$type: 'TokenLaunched' as const, queryId: _queryId, jettonMaster: _jettonMaster, bondingCurve: _bondingCurve, creator: _creator, name: _name, symbol: _symbol };
}

export function storeTupleTokenLaunched(source: TokenLaunched) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.jettonMaster);
    builder.writeAddress(source.bondingCurve);
    builder.writeAddress(source.creator);
    builder.writeString(source.name);
    builder.writeString(source.symbol);
    return builder.build();
}

export function dictValueParserTokenLaunched(): DictionaryValue<TokenLaunched> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenLaunched(src)).endCell());
        },
        parse: (src) => {
            return loadTokenLaunched(src.loadRef().beginParse());
        }
    }
}

export type FactoryWithdraw = {
    $$type: 'FactoryWithdraw';
    queryId: bigint;
    amount: bigint;
}

export function storeFactoryWithdraw(src: FactoryWithdraw) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2700491507, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
    };
}

export function loadFactoryWithdraw(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2700491507) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    return { $$type: 'FactoryWithdraw' as const, queryId: _queryId, amount: _amount };
}

export function loadTupleFactoryWithdraw(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    return { $$type: 'FactoryWithdraw' as const, queryId: _queryId, amount: _amount };
}

export function loadGetterTupleFactoryWithdraw(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    return { $$type: 'FactoryWithdraw' as const, queryId: _queryId, amount: _amount };
}

export function storeTupleFactoryWithdraw(source: FactoryWithdraw) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserFactoryWithdraw(): DictionaryValue<FactoryWithdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryWithdraw(src.loadRef().beginParse());
        }
    }
}

export type TreasuryFee = {
    $$type: 'TreasuryFee';
    queryId: bigint;
    tokenName: string;
}

export function storeTreasuryFee(src: TreasuryFee) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(656669876, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeStringRefTail(src.tokenName);
    };
}

export function loadTreasuryFee(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 656669876) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _tokenName = sc_0.loadStringRefTail();
    return { $$type: 'TreasuryFee' as const, queryId: _queryId, tokenName: _tokenName };
}

export function loadTupleTreasuryFee(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _tokenName = source.readString();
    return { $$type: 'TreasuryFee' as const, queryId: _queryId, tokenName: _tokenName };
}

export function loadGetterTupleTreasuryFee(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _tokenName = source.readString();
    return { $$type: 'TreasuryFee' as const, queryId: _queryId, tokenName: _tokenName };
}

export function storeTupleTreasuryFee(source: TreasuryFee) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeString(source.tokenName);
    return builder.build();
}

export function dictValueParserTreasuryFee(): DictionaryValue<TreasuryFee> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasuryFee(src)).endCell());
        },
        parse: (src) => {
            return loadTreasuryFee(src.loadRef().beginParse());
        }
    }
}

export type TreasuryWithdraw = {
    $$type: 'TreasuryWithdraw';
    queryId: bigint;
    amount: bigint;
    destination: Address;
}

export function storeTreasuryWithdraw(src: TreasuryWithdraw) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2171900176, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
    };
}

export function loadTreasuryWithdraw(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2171900176) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _destination = sc_0.loadAddress();
    return { $$type: 'TreasuryWithdraw' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function loadTupleTreasuryWithdraw(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'TreasuryWithdraw' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function loadGetterTupleTreasuryWithdraw(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'TreasuryWithdraw' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function storeTupleTreasuryWithdraw(source: TreasuryWithdraw) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    return builder.build();
}

export function dictValueParserTreasuryWithdraw(): DictionaryValue<TreasuryWithdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasuryWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadTreasuryWithdraw(src.loadRef().beginParse());
        }
    }
}

export type TreasurySetOwner = {
    $$type: 'TreasurySetOwner';
    newOwner: Address;
}

export function storeTreasurySetOwner(src: TreasurySetOwner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2749378339, 32);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadTreasurySetOwner(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2749378339) { throw Error('Invalid prefix'); }
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'TreasurySetOwner' as const, newOwner: _newOwner };
}

export function loadTupleTreasurySetOwner(source: TupleReader) {
    const _newOwner = source.readAddress();
    return { $$type: 'TreasurySetOwner' as const, newOwner: _newOwner };
}

export function loadGetterTupleTreasurySetOwner(source: TupleReader) {
    const _newOwner = source.readAddress();
    return { $$type: 'TreasurySetOwner' as const, newOwner: _newOwner };
}

export function storeTupleTreasurySetOwner(source: TreasurySetOwner) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserTreasurySetOwner(): DictionaryValue<TreasurySetOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasurySetOwner(src)).endCell());
        },
        parse: (src) => {
            return loadTreasurySetOwner(src.loadRef().beginParse());
        }
    }
}

export type CurveData = {
    $$type: 'CurveData';
    jettonMaster: Address;
    treasury: Address;
    realTonReserve: bigint;
    realTokenReserve: bigint;
    graduated: boolean;
    virtualTonReserve: bigint;
    virtualTokenReserve: bigint;
}

export function storeCurveData(src: CurveData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.jettonMaster);
        b_0.storeAddress(src.treasury);
        b_0.storeCoins(src.realTonReserve);
        b_0.storeCoins(src.realTokenReserve);
        b_0.storeBit(src.graduated);
        b_0.storeCoins(src.virtualTonReserve);
        const b_1 = new Builder();
        b_1.storeCoins(src.virtualTokenReserve);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCurveData(slice: Slice) {
    const sc_0 = slice;
    const _jettonMaster = sc_0.loadAddress();
    const _treasury = sc_0.loadAddress();
    const _realTonReserve = sc_0.loadCoins();
    const _realTokenReserve = sc_0.loadCoins();
    const _graduated = sc_0.loadBit();
    const _virtualTonReserve = sc_0.loadCoins();
    const sc_1 = sc_0.loadRef().beginParse();
    const _virtualTokenReserve = sc_1.loadCoins();
    return { $$type: 'CurveData' as const, jettonMaster: _jettonMaster, treasury: _treasury, realTonReserve: _realTonReserve, realTokenReserve: _realTokenReserve, graduated: _graduated, virtualTonReserve: _virtualTonReserve, virtualTokenReserve: _virtualTokenReserve };
}

export function loadTupleCurveData(source: TupleReader) {
    const _jettonMaster = source.readAddress();
    const _treasury = source.readAddress();
    const _realTonReserve = source.readBigNumber();
    const _realTokenReserve = source.readBigNumber();
    const _graduated = source.readBoolean();
    const _virtualTonReserve = source.readBigNumber();
    const _virtualTokenReserve = source.readBigNumber();
    return { $$type: 'CurveData' as const, jettonMaster: _jettonMaster, treasury: _treasury, realTonReserve: _realTonReserve, realTokenReserve: _realTokenReserve, graduated: _graduated, virtualTonReserve: _virtualTonReserve, virtualTokenReserve: _virtualTokenReserve };
}

export function loadGetterTupleCurveData(source: TupleReader) {
    const _jettonMaster = source.readAddress();
    const _treasury = source.readAddress();
    const _realTonReserve = source.readBigNumber();
    const _realTokenReserve = source.readBigNumber();
    const _graduated = source.readBoolean();
    const _virtualTonReserve = source.readBigNumber();
    const _virtualTokenReserve = source.readBigNumber();
    return { $$type: 'CurveData' as const, jettonMaster: _jettonMaster, treasury: _treasury, realTonReserve: _realTonReserve, realTokenReserve: _realTokenReserve, graduated: _graduated, virtualTonReserve: _virtualTonReserve, virtualTokenReserve: _virtualTokenReserve };
}

export function storeTupleCurveData(source: CurveData) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.jettonMaster);
    builder.writeAddress(source.treasury);
    builder.writeNumber(source.realTonReserve);
    builder.writeNumber(source.realTokenReserve);
    builder.writeBoolean(source.graduated);
    builder.writeNumber(source.virtualTonReserve);
    builder.writeNumber(source.virtualTokenReserve);
    return builder.build();
}

export function dictValueParserCurveData(): DictionaryValue<CurveData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCurveData(src)).endCell());
        },
        parse: (src) => {
            return loadCurveData(src.loadRef().beginParse());
        }
    }
}

export type DeployedAddresses = {
    $$type: 'DeployedAddresses';
    jettonMaster: Address;
    bondingCurve: Address;
}

export function storeDeployedAddresses(src: DeployedAddresses) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.jettonMaster);
        b_0.storeAddress(src.bondingCurve);
    };
}

export function loadDeployedAddresses(slice: Slice) {
    const sc_0 = slice;
    const _jettonMaster = sc_0.loadAddress();
    const _bondingCurve = sc_0.loadAddress();
    return { $$type: 'DeployedAddresses' as const, jettonMaster: _jettonMaster, bondingCurve: _bondingCurve };
}

export function loadTupleDeployedAddresses(source: TupleReader) {
    const _jettonMaster = source.readAddress();
    const _bondingCurve = source.readAddress();
    return { $$type: 'DeployedAddresses' as const, jettonMaster: _jettonMaster, bondingCurve: _bondingCurve };
}

export function loadGetterTupleDeployedAddresses(source: TupleReader) {
    const _jettonMaster = source.readAddress();
    const _bondingCurve = source.readAddress();
    return { $$type: 'DeployedAddresses' as const, jettonMaster: _jettonMaster, bondingCurve: _bondingCurve };
}

export function storeTupleDeployedAddresses(source: DeployedAddresses) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.jettonMaster);
    builder.writeAddress(source.bondingCurve);
    return builder.build();
}

export function dictValueParserDeployedAddresses(): DictionaryValue<DeployedAddresses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployedAddresses(src)).endCell());
        },
        parse: (src) => {
            return loadDeployedAddresses(src.loadRef().beginParse());
        }
    }
}

export type TreasuryData = {
    $$type: 'TreasuryData';
    owner: Address;
    balance: bigint;
    totalCollected: bigint;
    feeCount: bigint;
}

export function storeTreasuryData(src: TreasuryData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeCoins(src.balance);
        b_0.storeCoins(src.totalCollected);
        b_0.storeUint(src.feeCount, 32);
    };
}

export function loadTreasuryData(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _balance = sc_0.loadCoins();
    const _totalCollected = sc_0.loadCoins();
    const _feeCount = sc_0.loadUintBig(32);
    return { $$type: 'TreasuryData' as const, owner: _owner, balance: _balance, totalCollected: _totalCollected, feeCount: _feeCount };
}

export function loadTupleTreasuryData(source: TupleReader) {
    const _owner = source.readAddress();
    const _balance = source.readBigNumber();
    const _totalCollected = source.readBigNumber();
    const _feeCount = source.readBigNumber();
    return { $$type: 'TreasuryData' as const, owner: _owner, balance: _balance, totalCollected: _totalCollected, feeCount: _feeCount };
}

export function loadGetterTupleTreasuryData(source: TupleReader) {
    const _owner = source.readAddress();
    const _balance = source.readBigNumber();
    const _totalCollected = source.readBigNumber();
    const _feeCount = source.readBigNumber();
    return { $$type: 'TreasuryData' as const, owner: _owner, balance: _balance, totalCollected: _totalCollected, feeCount: _feeCount };
}

export function storeTupleTreasuryData(source: TreasuryData) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.balance);
    builder.writeNumber(source.totalCollected);
    builder.writeNumber(source.feeCount);
    return builder.build();
}

export function dictValueParserTreasuryData(): DictionaryValue<TreasuryData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasuryData(src)).endCell());
        },
        parse: (src) => {
            return loadTreasuryData(src.loadRef().beginParse());
        }
    }
}

export type Treasury$Data = {
    $$type: 'Treasury$Data';
    owner: Address;
    totalCollected: bigint;
    feeCount: bigint;
}

export function storeTreasury$Data(src: Treasury$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeCoins(src.totalCollected);
        b_0.storeUint(src.feeCount, 32);
    };
}

export function loadTreasury$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _totalCollected = sc_0.loadCoins();
    const _feeCount = sc_0.loadUintBig(32);
    return { $$type: 'Treasury$Data' as const, owner: _owner, totalCollected: _totalCollected, feeCount: _feeCount };
}

export function loadTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _totalCollected = source.readBigNumber();
    const _feeCount = source.readBigNumber();
    return { $$type: 'Treasury$Data' as const, owner: _owner, totalCollected: _totalCollected, feeCount: _feeCount };
}

export function loadGetterTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _totalCollected = source.readBigNumber();
    const _feeCount = source.readBigNumber();
    return { $$type: 'Treasury$Data' as const, owner: _owner, totalCollected: _totalCollected, feeCount: _feeCount };
}

export function storeTupleTreasury$Data(source: Treasury$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.totalCollected);
    builder.writeNumber(source.feeCount);
    return builder.build();
}

export function dictValueParserTreasury$Data(): DictionaryValue<Treasury$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasury$Data(src)).endCell());
        },
        parse: (src) => {
            return loadTreasury$Data(src.loadRef().beginParse());
        }
    }
}

 type Treasury_init_args = {
    $$type: 'Treasury_init_args';
    owner: Address;
    totalCollected: bigint;
    feeCount: bigint;
}

function initTreasury_init_args(src: Treasury_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeCoins(src.totalCollected);
        b_0.storeUint(src.feeCount, 32);
    };
}

async function Treasury_init(owner: Address, totalCollected: bigint, feeCount: bigint) {
    const __code = Cell.fromHex('b5ee9c7241020f010001f7000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9010b020271020702014803050127b4a25da89a1f481f401a63eaa40d827b678d8690040010f8276f10546331230127b734bda89a1f481f401a63eaa40d827b678d86300600022202012008090095bbbd182705cec3d5d2cae7b1e84ec39d64a851b6682709dd6352d2b647cb322d3af2dfdf1623982702055c01b80676394ce583aae4725b2c382701bd49def954596f1c753d3de0559c32680127bbd27ed44d0fa40fa00d31f55206c13db3c6c3180a0008f8276f1003f83001d072d721d200d200fa4021103450666f04f86102f862ed44d0fa40fa00d31f55206c1304925f04e07023d74920c21f953103d31f04de2182102723fcb4ba8e255b32f8416f24135f038200cd4321c200f2f412a002a412c855205023ce01fa02cb1fc9ed54e021821081749110bae302218210a3e02f23bae3020c0d0e00a45f0332d33ffa00fa4030817e06f8425005c70514f2f4f8276f10820afaf080a12181597d02bbf2f4810dc921c200f2f47071c814cb3fc941304343c8cf8580ca00cf8440ce01fa02806acf40f400c901fb0000405b02fa4030817e06f8425003c70512f2f402c855205023ce01fa02cb1fc9ed54006434c00003c12113b08e22f8416f24135f0320c2009512a002a4599130e202c855205023ce01fa02cb1fc9ed54e05f03f2c082728294a3');
    const builder = beginCell();
    initTreasury_init_args({ $$type: 'Treasury_init_args', owner, totalCollected, feeCount })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const Treasury_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    3529: { message: "Treasury: zero withdrawal" },
    22909: { message: "Treasury: insufficient balance" },
    32262: { message: "Treasury: owner only" },
    52547: { message: "Treasury: zero fee" },
} as const

export const Treasury_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Treasury: zero withdrawal": 3529,
    "Treasury: insufficient balance": 22909,
    "Treasury: owner only": 32262,
    "Treasury: zero fee": 52547,
} as const

const Treasury_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Buy","header":1422049996,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"minTokensOut","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"LaunchToken","header":3373264781,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"symbol","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"imageUrl","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"TokenLaunched","header":1839890722,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"jettonMaster","type":{"kind":"simple","type":"address","optional":false}},{"name":"bondingCurve","type":{"kind":"simple","type":"address","optional":false}},{"name":"creator","type":{"kind":"simple","type":"address","optional":false}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"symbol","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"FactoryWithdraw","header":2700491507,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"TreasuryFee","header":656669876,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"tokenName","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"TreasuryWithdraw","header":2171900176,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TreasurySetOwner","header":2749378339,"fields":[{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CurveData","header":null,"fields":[{"name":"jettonMaster","type":{"kind":"simple","type":"address","optional":false}},{"name":"treasury","type":{"kind":"simple","type":"address","optional":false}},{"name":"realTonReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"realTokenReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"graduated","type":{"kind":"simple","type":"bool","optional":false}},{"name":"virtualTonReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"virtualTokenReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"DeployedAddresses","header":null,"fields":[{"name":"jettonMaster","type":{"kind":"simple","type":"address","optional":false}},{"name":"bondingCurve","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TreasuryData","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalCollected","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"feeCount","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"Treasury$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalCollected","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"feeCount","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
]

const Treasury_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "Buy": 1422049996,
    "LaunchToken": 3373264781,
    "TokenLaunched": 1839890722,
    "FactoryWithdraw": 2700491507,
    "TreasuryFee": 656669876,
    "TreasuryWithdraw": 2171900176,
    "TreasurySetOwner": 2749378339,
}

const Treasury_getters: ABIGetter[] = [
    {"name":"get_treasury_data","methodId":66834,"arguments":[],"returnType":{"kind":"simple","type":"TreasuryData","optional":false}},
    {"name":"get_balance","methodId":130343,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_owner","methodId":80293,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const Treasury_getterMapping: { [key: string]: string } = {
    'get_treasury_data': 'getGetTreasuryData',
    'get_balance': 'getGetBalance',
    'get_owner': 'getGetOwner',
}

const Treasury_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TreasuryFee"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TreasuryWithdraw"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TreasurySetOwner"}},
]


export class Treasury implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = Treasury_errors_backward;
    public static readonly opcodes = Treasury_opcodes;
    
    static async init(owner: Address, totalCollected: bigint, feeCount: bigint) {
        return await Treasury_init(owner, totalCollected, feeCount);
    }
    
    static async fromInit(owner: Address, totalCollected: bigint, feeCount: bigint) {
        const __gen_init = await Treasury_init(owner, totalCollected, feeCount);
        const address = contractAddress(0, __gen_init);
        return new Treasury(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new Treasury(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Treasury_types,
        getters: Treasury_getters,
        receivers: Treasury_receivers,
        errors: Treasury_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | TreasuryFee | TreasuryWithdraw | TreasurySetOwner) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TreasuryFee') {
            body = beginCell().store(storeTreasuryFee(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TreasuryWithdraw') {
            body = beginCell().store(storeTreasuryWithdraw(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TreasurySetOwner') {
            body = beginCell().store(storeTreasurySetOwner(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetTreasuryData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_treasury_data', builder.build())).stack;
        const result = loadGetterTupleTreasuryData(source);
        return result;
    }
    
    async getGetBalance(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_balance', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_owner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
}