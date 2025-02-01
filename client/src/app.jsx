import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './styles/styles.css';
import Layout from './pages/layout';

const root = document.getElementById('root');
const app = <Layout />;
ReactDOM.render(app, root);
