import AppHeader from "./AppHeader/appHeader";
import Sidebar from "./Sidebar/sidebar";
import "./project.scss";
import { segmentOptions, segmentOptions1 } from "Constant";
import { useTranslation } from "react-i18next";
const Project = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="fixed-wrapper">
        <Sidebar />
        <AppHeader />
        <div>
          {segmentOptions1.map((e, index) => (
            <div key={index.toString()}>{t(e.label)}</div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Project;
