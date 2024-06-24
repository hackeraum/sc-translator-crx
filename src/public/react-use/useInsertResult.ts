import { useCallback, useRef, useState } from "react";
import { DefaultOptions } from "../../types";
import { confirmInsertion, insertTranslationToggle } from "../insert-result";
import { resultToString } from "../utils";
import useOptions from "./useOptions";

type PickedOptions = Pick<DefaultOptions, 'enableInsertResult' | 'autoInsertResult'>
const useOptionsDependency: (keyof PickedOptions)[] = ['enableInsertResult', 'autoInsertResult'];

/**
 * You need to confirm before insert toggle.
 */
const useInsertResult = () => {
    const [insertable, setInsertable] = useState(false);

    const autoInsertedRef = useRef(false);

    const { enableInsertResult, autoInsertResult } = useOptions<PickedOptions>(useOptionsDependency);

    const confirmInsert = useCallback((text: string, translateId: number) => {
        setInsertable(enableInsertResult && confirmInsertion(text, translateId));

        autoInsertedRef.current = false;
    }, [enableInsertResult]);

    const insertToggle = useCallback((translateId: number, translateSource: string, result: string) => {
        insertTranslationToggle(translateId, translateSource, result);
    }, []);

    const autoInsert = useCallback((translateId: number, translateSource: string, result: string[]) => {
        if (!autoInsertResult || autoInsertedRef.current) { return; }

        insertTranslationToggle(translateId, translateSource, resultToString(result));

        autoInsertedRef.current = true;
    }, [autoInsertResult]);

    return { insertable, confirmInsert, insertToggle, autoInsert };
};

export default useInsertResult;