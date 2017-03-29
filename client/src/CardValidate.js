
import React from 'react';
import Client from './Client';

const MATCHING_ITEM_LIMIT = 25;

class CardValidate extends React.Component {
  state = {
    showRemoveIcon: false,
    cardNumber: '',
    cardCvv:'',
    cardDescription:'',
    isCcVerified:false,
    rtvVerified:false,
    validationStatus: false,
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
        });
      } else {
        this.setState({
          isCcVerified: cardRes[0].isCCVerified,
        });
      };
      if(cardRes[0].paymentExceptions){
        this.setState({
          paymentExceptionMessage: cardRes[0].paymentExceptions[0].message,
          paymentExceptionCode: cardRes[0].paymentExceptions[0].code
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
        <td>Card Result</td>
        <td className='right aligned'>{this.state.isCcVerified.toString()}</td>
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
			<label>
                        Card Number:  
                        <input type="text" value={this.state.cardNumber} onChange={this.handleChange} />
                        </label>
		      </div>
                      <div className="field">
                        <label>
                        Card Cvv:  
                        <input type="text" value={this.state.cardCvv} onChange={this.handleCvvChange} />
                        </label>
                      </div>
                      <input type="submit" value="Submit" />
                    </form>
                    <i className='search icon' />
                  </div>
                  <i
                    className='remove icon'
                    onClick={this.handleRtvCancel}
                    style={removeIconStyle}
                  />
                </div>
              </th>
            </tr>
            <tr>
              <th className='eight wide'>Description</th>
              <th>isCCVerified</th>
              <th>rtvResponse</th>
              <th>validationStatus</th>
              <th>code</th>
			  <th>description</th>
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
