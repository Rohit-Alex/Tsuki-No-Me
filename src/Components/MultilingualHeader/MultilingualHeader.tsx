import { useTranslation } from "react-i18next";
import { Segmented, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { columnsMG, segmentOptions } from "../../Constant";
import ReactQueryTodo from "../ReactQuery/ReactQueryTodo";
import ReactQueryDetails from "../ReactQuery/ReactQueryDetails";
import DynamicParallelPage from "../ReactQuery/DynamicParallelPage";
import { PaginatedQueriesPage } from "../ReactQuery/PaginatedQueries";
import { InfiniteQueriesPage } from "../ReactQuery/InfiniteQueryPage";
import { RQSuperHeroesPage } from "../ReactQuery/AddSuperHereos";
import DependentQueryPage from "../ReactQuery/DependentQueryPage";
import { ReactPaginatedQueryProvider } from "../../Context/ReactQueryPaginatedContext";

export default function MultilingualHeader() {
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState<string | number>("react_query");

  // useEffect(() => {
  //     i18n.changeLanguage('en')
  // }, [])

  // const segmentOptionsMemoized = useMemo(() => {
  //     return segmentOptions()
  // }, [i18n.language])

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];
  return (
    <div className="">
      <h1>{t("WELCOME")}</h1>
      {/* To check if the segmentOptions gets translated correctly on changing the language */}
      <Segmented
        options={segmentOptions()}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
      {value === "react_query" && <ReactQueryTodo />}
      {value === "dynamic_parallel" && <DynamicParallelPage todoIds={[1, 3]} />}
      {value === "pagination" && (
        <ReactPaginatedQueryProvider>
          <PaginatedQueriesPage />
        </ReactPaginatedQueryProvider>
      )}
      {value === "infinte" && <InfiniteQueriesPage />}
      {value === "mutation" && <RQSuperHeroesPage />}
      {value === "dependent" && (
        <DependentQueryPage email={"vishwas@example.com"} />
      )}
      <Table dataSource={dataSource} columns={columnsMG()} />;
    </div>
  );
}
