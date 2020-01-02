import React from 'react';
import CodeEditor from './CodeEditor';
import { useFetchData } from './httpUtils';

// More complex example passing a callback to callApi that will be invoked later

const TestEditor = ({ test, number, children, challengeId, refreshData }) => {
  const [res, callApi] = useFetchData({
    url: `/api/test/${
      test.hasOwnProperty('challenge_test_id')
        ? test.challenge_test_id
        : challengeId
    }`,
    method: test.hasOwnProperty('challenge_test_id') ? 'put' : 'post'
  });

  const handleSubmit = async val => {
    callApi(
      { testDetails: val, challengeId },
      { cb: refreshData, cbArgs: [true] }
    );
  };

  return (
    <div className="test-editor">
      <p>Test {number}</p>
      <CodeEditor
        editorStartingValue={test.test}
        handleSubmit={handleSubmit}
        height={'300px'}
      />
      {children}
    </div>
  );
};

export default TestEditor;

import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { useFetchData } from '../../Hooks/axiosHooks';
import { setSections, setPrograms } from '../../Redux/actionCreators';
import Sections from './Sections';
import SectionChallenges from './SectionChallenges';
import AddOrEdit from './AddOrEdit';
import Programs from './Programs';

// Using for regular get requests similar to componentDidMount

const Admin = ({ match, setSections, setPrograms, sections, programs }) => {
  // TODO: Have this change based on the program chosen
  const [sectionRes, sectionCall] = useFetchData({
    url: '/api/sections'
  });

  const [programRes, programCall] = useFetchData({
    url: '/api/programs'
  });

  if (!sectionRes.called) sectionCall();

  if (!sections.length) setSections(sectionRes.data);

  if (!programRes.called) programCall();

  if (!programs.length) setPrograms(programRes.data);

  return (
    <Switch>
      <Route path="/admin/programs" component={Programs} />
      <Route exact path="/admin/:programName/sections" component={Sections} />
      <Route
        exact
        path="/admin/:programName/sections/:section_name"
        component={SectionChallenges}
      />
      <Route path="/admin/challenge" component={AddOrEdit} />
    </Switch>
  );
};

const mapStateToProps = ({ admin }) => {
  return admin;
};

export default connect(mapStateToProps, { setSections, setPrograms })(Admin);
