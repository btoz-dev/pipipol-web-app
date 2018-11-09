import React, { Component } from 'react';
import List from "./List";

class Search extends Component {

    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            filters: '',
            sorters: '',
            cat: ''
        }
    }

  state = {
    value: ''
  };

  options = ['hobi', 'makanan']

  onClick = () => {
    this.child.current.searchPollsByCat(this.state.cat);
  };

  handleSelectChange (e) {
      
    this.setState({
      value: e.target.value
    });
    console.log(this.state.value)
    this.child.current.searchPollsByCat(this.state.value);
  }

  render() {
    
    const filters = [{ property: 'kategori', value: '' }, { property: 'title', value: 'a'}]
    const sorters = [{ property: this.state.value, direction: 'DESC' }]

    // this.setState({
    //     filters: filters,
    //     sorters: sorters
    // })

    return (
        // POLLING LIST
        <div className="poll-grids-container text-center">

            <div className="poll-grids-title">
                <h2 className="text-center">Polling List</h2>
            </div>

            <div>{this.state.cat}</div>

            <select 
                value={this.state.value}
                onChange={e => this.handleSelectChange(e)}
                >
                {[
                    <option disabled key="_default" value="_default">
                        select one...
                    </option>,
                    ...this.options.map(
                        item => (
                        <option key={item} value={item.toLowerCase()}>{item}</option>
                        )
                    )
                ]}
            </select>

            <div className="poll-grids container-fluid">
                <List ref={this.child} filters={this.state.filters} sorters={this.state.sorters} />
            </div>
        </div>

    );
  }
  
}

export default Search;
