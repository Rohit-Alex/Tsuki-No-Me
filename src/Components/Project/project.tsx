import AppHeader from "./AppHeader/appHeader";
import Sidebar from "./Sidebar/sidebar";
import "./project.scss";
import { segmentOptions, segmentOptions1 } from "Constant";
import { useTranslation } from "react-i18next";
import TranslationsExp from "./Components/TranslationsExp";
const Project = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="fixed-wrapper">
        <Sidebar />
        <div style={{ width: "100%" }}>
          <AppHeader />
          <div className="ctn-bdy">
            {segmentOptions1.map((e, index) => (
              <div key={index.toString()}>{t(e.label)}</div>
            ))}
            <TranslationsExp />
          </div>
        </div>
      </div>
    </>
  );
};
export default Project;
