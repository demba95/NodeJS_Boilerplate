import * as Type from '@cTypes';

export const titleCase: Type.TitleCaseFn = (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
};
