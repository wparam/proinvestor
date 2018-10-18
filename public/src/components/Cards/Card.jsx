import React, { Component } from 'react';


export default class Card extends Component{
    render(){
        return (
            <div className='card'>
                <div className='header'>
                    <h4 className='title'>{this.props.title}</h4>
                    <p className='category'>{this.props.category}</p>
                </div>
                <div className='content'>
                    {this.props.content}
                    
                    <div className='footer'>
                        {this.props.legend}
                        {this.props.stats != null ? <hr />:''}
                        <div className='stats'>
                            <i className={this.props.statsIcon}></i> {this.props.stats}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
