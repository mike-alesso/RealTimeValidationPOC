
import React from 'react';
import Client from './Client';

const MATCHING_ITEM_LIMIT = 25;

class CardValidate extends React.Component {
  state = {
    showRemoveIcon: false,
    cardNumber: '',
    cardCvv:'',
    cardDescription:'',
    isCcVerified:'',
    rtvVerified:'',
    validationStatus: '',
    addressValidationResult:'',
    cvvValidationResult:'',
    isPrepaidCard: false,
    transactionSummary: '',
    transactionId:'',
    bepResponseCode:'',
    bepResponseMessage:'',
    paymentExceptionMessage: '',
    paymentExceptionCode: ''
  };

  handleSubmit = (e) => {
    e.preventDefault();
    Client.ccVerify(this.state.cardNumber, this.state.cardCvv, (cardRes) => {
      if(cardRes[0].rtvResponse){
        this.setState({
        isCcVerified: cardRes[0].isCCVerified,
        rtvVerified: cardRes[0].rtvResponse.rtvVerified,
        validationStatus: cardRes[0].rtvResponse.validationStatus,
        transactionSummary: cardRes[0].rtvResponse.transactionSummary,
        transactionId: cardRes[0].rtvResponse.transactionId,
        bepResponseCode: cardRes[0].rtvResponse.bepResponseCode,
        bepResponseMessage: cardRes[0].rtvResponse.bepResponse
        });
      } else {
        this.setState({
          isCcVerified: cardRes[0].isCCVerified,
          rtvVerified: '',
          validationStatus: '',
          transactionSummary: '',
          transactionId: '',
          bepResponseCode: '',
          bepResponseMessage: ''
        });
      };
      if(cardRes[0].paymentExceptions){
        this.setState({
          paymentExceptionMessage: cardRes[0].paymentExceptions[0].message,
          paymentExceptionCode: cardRes[0].paymentExceptions[0].code
        });
      }
      else {
        this.setState({
          paymentExceptionMessage: '',
          paymentExceptionCode: ''
        });
      }
    });
  };
  
  
  handleChange = (e) => {
    var _cardNum = e.target.value;
    //alert(_cardNum);
    this.setState({
      cardNumber: _cardNum,
    });

    if (_cardNum === '') {
      this.setState({
        showRemoveIcon: false,
	cardNumber: '',
	cardResult: {}
      });
    } else {
      this.setState({
        showRemoveIcon: true,
	cardResult: {}
      });
    };
  };
  handleCvvChange = (e) => {
    var _cardCvv = e.target.value;
    //alert(_cardNum);
    this.setState({
      cardCvv: _cardCvv,
    });

    if (_cardCvv === '') {
      this.setState({
        showRemoveIcon: false,
        cardCvv: '',
        cardResult: {}
      });
    } else {
      this.setState({
        showRemoveIcon: true,
        cardResult: {}
      });
    };
  };


  handleRtvCancel = () => {
    this.setState({
    showRemoveIcon: false,
    cardNumber: '',
    cardResult: {}
    });
  };

  render() {
    const { showRemoveIcon, cardResult, paymentExceptions } = this.state;
    const removeIconStyle = showRemoveIcon ? {} : { visibility: 'hidden' };

    const cardRows = ( 
      <tr>
        <td className='right aligned'>{this.state.transactionSummary}</td>
        <td className='right aligned'>{this.state.transactionId}</td>
        <td className='right aligned'>{this.state.rtvVerified.toString()}</td>
        <td className='right aligned'>{this.state.validationStatus}</td>
        <td className='right aligned'>{this.state.paymentExceptionCode}</td>
	<td className='right aligned'>{this.state.paymentExceptionMessage}</td>
      </tr>
    );

    return (
      <div id='card-verify'>
        <table className='ui selectable structured large table'>
          <thead>
            <tr>
              <th colSpan='7'>
                <div className='ui fluid search'>
                  <div className='ui icon input'>
		    <form onSubmit={this.handleSubmit}>
                      <div className="field">
                        <input type="text" placeholder="Card Number..." value={this.state.cardNumber} onChange={this.handleChange} />
		      </div>
                      <br />
                      <div className="field">
                        <input type="text" placeholder="Card CVV..."  value={this.state.cardCvv} onChange={this.handleCvvChange} />
                      </div>
                      <div>
                      <input type="submit" value="Submit" />
                      </div>
                    </form>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th>Transaction Summary</th>
              <th>Transaction Id</th>
              <th>Rtv Verified?</th>
              <th>Validation Status</th>
              <th>Error Code</th>
	      <th>Error Description</th>
            </tr>
          </thead>
          <tbody>
            {cardRows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default CardValidate;
