import React from 'react';
import Load from '../loading/loader';
import moment from 'moment';
import { fbdatabase } from '../../api'
import '../../style.css'

const UID = localStorage.getItem('u:money')

const query_receber = fbdatabase.ref(`${UID}/receber`);

const ref = query_receber;


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
                { 
                  data.paid === true ? 
                  <i
                  style={{ color: 'green' }}
                  className="material-icons">
                  check
                </i>
                  : 
                  <i
                  id="quitar_divida"
                  onClick={
                    () => {
                      ref.child(data.id).update({ paid: true })
                      window.location.reload()
                    }
                  }
                  style={{ color: 'red' }}
                  className="material-icons">
                  close
                </i>
                }
              </td>
              <td
                style={{
                  color: data.valor >= 100 ? 'red' : 'black'
                }}
              >
                { data.pessoa } <br />
                {
                 moment(data.date).fromNow()
                }
              </td>
              <td style={{ color: data.paid === true ? 'green' : 'red' }}> R$ { data.valor } </td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  </div>
)