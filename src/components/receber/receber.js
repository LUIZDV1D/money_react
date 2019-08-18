import React from 'react';
import Load from '../loading/loader';
import moment from 'moment';



export default ({ dados }) => (

  <div>
    <div id="scrolling_receber"  className="add_gasto">

      { dados.l_receber === true ? 
      <Load /> 

      : <p style={{ color: 'black' }}> { dados.msg_receber } </p>  }

      <table style={{ color: 'black' }}>
        <tbody>
        { 
          dados.receber.map((data, i) => (
            <tr key={i}>
              <td>
                <i
                  style={{ color: 'red' }}
                  className="material-icons">
                  close
                </i>
              </td>
              <td
                style={{color: data.valor >= 100 ? 'red' : 'black'}}
              >
                { data.pessoa } <br />
                {
                 moment(data.date).fromNow()
                }
              </td>
              <td style={{ color: 'red' }}> R$ { data.valor } </td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  </div>
)