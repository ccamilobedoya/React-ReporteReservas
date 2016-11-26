import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Datetime from 'react-datetime';
import $ from 'jquery';

var App = React.createClass ({

  getInitialState(){
    return{
      fechaInicial: '',
      fechaFinal: '',
      reservas: []
    };
  },

  handleDateI:function(event){
    this.setState({
      fechaInicial: event
    });
  },

  handleDateF:function(event){
    this.setState({
      fechaFinal: event
    });
  },

  search:function(){
    // Convierte el timestamp a moment
    var f1 = moment(this.state.fechaInicial);
    // Crea un string con el formato indicado
    var sf1 = f1.format("YYYY-MM-DD") + "T" + f1.format("HH:mm:ss") + "Z";

    var f2 = moment(this.state.fechaFinal);
    var sf2 = f2.format("YYYY-MM-DD") + "T" + f2.format("HH:mm:ss") + "Z";

    var params = {
      'fromInitialDate':sf1,
      'toFinalDate':sf2
    }
    $.ajax({
      url: 'http://haskell-rest.herokuapp.com/reservacionesPorFecha',
      async: true,
    	crossDomain: true,
      method: 'POST',
    	cache: false,
    	context: this,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(params),
	    success: function(data) {
        console.log(data);
        this.setState({
          reservas: data
        });
        if (data.length == 0) {
          this.setState({
            reservas: ['No hay datos encontrados']
          });
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      }
    });
  },

  render() {
    return (
      <div>
        <label>Fecha Inicial:</label>
        <Datetime onChange={this.handleDateI}/>
        <label>Fecha Final:</label>
        <Datetime onChange={this.handleDateF}/>
        <input type="submit" onClick={this.search} value="Buscar"/>
        <br></br>
        { this.state.reservas.map(function(item) {
            return <div>ID: {item.id_reservation} <br/>
            Restaurante: {item.restaurant} <br/>
            Fecha Inicial: {item.initialDate} <br/>
            Fecha Final: {item.finalDate} <br/>
            Invitados: {item.guests} <br/>
          <hr/></div>
          })
        }

      </div>


    );
  }
});

export default App;
