import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ResultsListItem from '../../components/DefaultResult/resultsListItem';
import * as ColorPagesActions from '../../redux/actions';

export default class ResultModal extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  handleSelect (imgIdx) { this.props.actions.changeImage(imgIdx); window.apply_styles();}

  handleClose () { this.props.actions.hideModal(false); }

  handlePrevious () {
    let colIdx = this.props.colIdx - 1; console.log(colIdx);
    let aliases = this.props.collectionData[this.props.collections[colIdx].uuid].aliases; console.log(aliases);
    this.props.actions.changeCollection({colIdx, aliases, direction: 'right'});
  }

  handleNext () {
    let colIdx = this.props.colIdx + 1;
    let aliases = this.props.collectionData[this.props.collections[colIdx].uuid].aliases;
    this.props.actions.changeCollection({colIdx, aliases, direction: 'left'});
  }

  render () {
    const galleryItems = this.props.aliases.map((alias, idx, arr) => {
      return (
        <ResultsListItem
          image={`/media/alias/${alias}`}
          idx={idx}
          showImage={this.handleSelect}
          selected={idx === this.props.imgIdx}/>
      );
    });

    return (
      <Modal className={"modal-container " + this.props.direction} show={this.props.show} onHide={this.handleClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton={true} onHide={this.handleClose}/>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 preview">
              <iframe id='preview' src={`/media/alias/${this.props.aliases[this.props.imgIdx]}`} onLoad={() => window.apply_styles()}></iframe>
            </div>
            <div className="col-md-6 more">
              <div className='galleryWrap'>
                {galleryItems}
              </div>
            </div>
          </div>
          <div className='modalButtonsWrap'>
              <button type="button" className="btn btn-primary btn-lg raised" onClick={() => { window.frames[0].print() } }>Print</button>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <div className={this.props.colIdx ? 'left-arrow' : 'left-arrow hidden'} onClick={this.handlePrevious}>
            <div className="bg">
              <i className='fa fa-arrow-left' aria-hidden='true'></i>
            </div>
          </div>
          <div className={this.props.colIdx === this.props.collections.length - 1 ? 'right-arrow hidden' : 'right-arrow'} onClick={this.handleNext}>
            <div className="bg">
              <i className='fa fa-arrow-right' aria-hidden='true'></i>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}


const mapStateToProps = ({modal}) => ({ 
  show: modal.show, 
  collectionData: modal.collectionData,
  collections: modal.collections,
  colIdx: modal.colIdx,
  aliases: modal.aliases, 
  imgIdx: modal.imgIdx,
  direction: modal.direction
});


const mapDispatchToProps = (dispatch) => (
  { actions: bindActionCreators(ColorPagesActions, dispatch) }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultModal);
