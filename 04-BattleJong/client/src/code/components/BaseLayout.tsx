import React, { Component } from "react";

import ControlArea from "./ControlArea";
import { createState } from "../state";

class BaseLayout extends Component {
  state = createState(this);

  render() {
    return (
      <div className="appContainer">
        <div className="controlArea">
          <ControlArea state={this.state} />
        </div>
      </div>
    );
  }
}

export default BaseLayout;
