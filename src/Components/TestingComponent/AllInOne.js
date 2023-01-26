import React, { useCallback, useEffect, useState } from "react";
import Dropdown from "./CustomDropdownJarvis";
import { getOptions } from "Utilies/utils";

export default function AllInOne() {
    const [val, setVal] = useState("");
    const [entity1, setEntity1] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [currPage, setCurrPage] = useState(1);

    const getOptionsFn = async () => {
        if (currPage > 3) return;
        setLoading(true);
        // try {
        //     const res = await getOptions(currPage)
        //     setOptions((prev) => [...prev, ...res]);
        // } catch (err) {
        //     console.log(err, 'error ---------->>>>')
        // } finally {
        //     setLoading(false);
        // }
        getOptions(currPage)
            .then((res) => {
                setOptions((prev) => [...prev, ...res]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (entity1) {
            getOptionsFn()
        }
    }, [currPage, entity1]);

    const cbForReachedBottom = useCallback(() => {
        setCurrPage((prev) => prev + 1);
    }, []);

    return (
        <div className="">
            <Dropdown
                title="Select Entity 1"
                label="Entity 1"
                options={[
                    { label: "Seller", value: "seller" },
                    { label: "Test", value: "test" }
                ]}
                onSelected={({ value }) => {
                    setEntity1(value);
                }}
                value={{
                    label: entity1 || "Select Entity 1",
                    value: entity1
                }}
            // cbForReachedBottom={() => {}}
            />
            <Dropdown
                title="Select Entity 2"
                label="Entity 2"
                options={options}
                onSelected={(value) => {
                    setVal(value.value);
                }}
                value={{
                    label: val || "Select Entity 2",
                    value: val
                }}
                cbForReachedBottom={cbForReachedBottom}
                isLoading={loading}
                disabled={!entity1}
            />
        </div>
    );
}
