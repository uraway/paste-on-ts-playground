import * as ReactDOM from 'react-dom';
import { useState } from 'react';
import { Tab } from '../components/atoms/Tab';
import { TabList } from '../components/atoms/TabList';
import { TabPanel } from '../components/atoms/TabPanel';
import { TabPanels } from '../components/atoms/TabPanels';
import { Tabs } from '../components/atoms/Tabs';
import { TSEditor } from '../components/TSEditor';
import { Preview } from '../components/Preview';
import { useTSVersions } from '../utils/hooks/useTSVersions';
import { useOptions } from '../utils/hooks/useOptions';
import styled from 'styled-components';
import { browser } from 'webextension-polyfill-ts';

export interface Outputs {
  js: string;
  dts: string;
  log?: string;
}

const StyledContainer = styled.div`
  padding: 0 2rem;
`;

export const Popup = () => {
  const { tsVersions } = useTSVersions();
  const { options, onChangeOption } = useOptions({ tsVersions });
  const [outputs, setOutputs] = useState<Outputs>({
    js: '',
    dts: '',
    log: '',
  });

  const executeJs = async () => {
    const overrideConsole = `
(() => {
    const rowConsole = console;
    const logs = [];

    const createLogBind = (type) => {
        rowConsole[type] = (value) => logs.push("[" + type + "] " + value)
    }
    createLogBind("log")
    createLogBind("warn")
    createLogBind("error")
    createLogBind("debug")

    ${outputs.js}
    return logs
})()`;

    const onExecuted = (result: any[]) => {
      setOutputs({
        ...outputs,
        log: `${outputs.log ?? ''}\n${result?.join('\n')}`,
      });
    };
    // const onError = (err: any) => {
    //     setOutputs({
    //         ...outputs,
    //         log: `${outputs.log ?? ""}\n${err}\n`,
    //     });
    // };
    browser.tabs
      .executeScript({
        code: overrideConsole,
      })
      .then(onExecuted);
  };

  return (
    <StyledContainer>
      <Tabs>
        <TabList>
          <Tab>Editor</Tab>
          <Tab>JS</Tab>
          <Tab>.d.ts</Tab>
          <Tab onClick={executeJs}>Run</Tab>
          <Tab onClick={() => chrome.runtime.openOptionsPage()}>Option</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TSEditor
              options={options}
              onCompileTS={setOutputs}
              onChangeOption={onChangeOption}
            />
          </TabPanel>
          <TabPanel>
            <Preview options={options} value={outputs.js} />
          </TabPanel>
          <TabPanel>
            <Preview options={options} value={outputs.dts} />
          </TabPanel>
          <TabPanel>
            <Preview options={options} value={outputs.log ?? ''} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </StyledContainer>
  );
};

document.addEventListener('DOMContentLoaded', (event) => {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  ReactDOM.render(<Popup />, app);
});
