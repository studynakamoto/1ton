import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/Treasury.tact',
    options: {
        debug: true,
        interfacesGetter: true,
    },
};
