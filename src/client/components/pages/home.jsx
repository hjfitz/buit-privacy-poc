import React, { Component } from 'react';
import axios from 'axios';
import M from 'materialize-css';

import marked from 'marked';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: [],
      formatted: [],
    };
  }

  componentDidMount() {
    // perfect place to hit an endpoint and set state
    axios.get('/api/contentful/').then(({ data }) => {
      // prepare data
      console.log(data);
      const countries = data.map(item => {
        const { fields, sys } = item;
        const { id } = sys;
        const { url } = item.fields.countryFlag.fields.file;
        const { countryName, privacyStatements } = item.fields;

        const formattedStatements = privacyStatements.map(priv => {
          const { fields: { language, privacyText }, sys: { id } } = priv;
          const inner = (
            <li key={id}>
              <div className="collapsible-header">{language}</div>
              <div className="collapsible-body"><span dangerouslySetInnerHTML={{ __html: marked(privacyText) }} /></div>
            </li>
          );
          return inner;
        });
        const large = (
          <div className="row" key={id}>
            <div className="col s12">
              <div className="card">
                <div className="card-image">
                  <img src={url} alt={countryName} />
                  <span className="card-title">{fields.countryName}</span>
                </div>
                <div className="card-content">
                  <ul className="collapsible">

                    {formattedStatements}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        const icon = (
          <div
            className="col s6 m3"
            key={`icon-${id}`}
          >
            <div className="card hoverable pointer">
              <div className="card-image">
                <img
                  src={url}
                  alt={countryName}
                  onClick={() => {
                    this.setState({ shown: large }, () => {
                      Array.from(document.querySelectorAll('.collapsible')).forEach(elem => {
                        M.Collapsible.init(elem);
                      });
                    });
                  }}
                />
              </div>
            </div>
          </div>
        );
        return { large, icon };
      });
      const formatted = countries.reduce((acc, cur) => {
        acc.large.push(cur.large);
        acc.icon.push(cur.icon);
        return acc;
      }, { large: [], icon: [] });
      this.setState(formatted);
    });
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.icon}
        </div>
        {this.state.shown}
      </div>
    );
  }
}
