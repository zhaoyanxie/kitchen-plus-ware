import React, { Component } from "react";
import { Button, Container, Form, Message } from "semantic-ui-react";
import { API_URL } from "../utils/configVar";

class AddProducts extends Component {
  constructor() {
    super();
    this.state = {
      category: "",
      details: {
        code: "",
        description: "",
        uom: "",
        minQty: "",
        imgSrc: []
      },
      bError: false,
      errorMsg: ""
    };
  }

  splitImgSrc = value => value.split(",").map(link => link.trim());

  handleChange = (event, field) => {
    const { category } = this.state;
    const { code, description, uom, minQty, imgSrc } = this.state.details;

    this.setState({
      category: field === "category" ? event.target.value : category,
      details: {
        code: field === "code" ? event.target.value : code,
        description: field === "description" ? event.target.value : description,
        uom: field === "uom" ? event.target.value : uom,
        minQty: field === "minQty" ? event.target.value : minQty,
        imgSrc:
          field === "imgSrc" ? this.splitImgSrc(event.target.value) : imgSrc
      }
    });
  };

  addProduct = async () => {
    const { code, description, uom, minQty, imgSrc } = this.state.details;
    return await fetch(`${API_URL}admin/add_product`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        category: this.state.category,
        details: {
          code,
          description,
          uom: uom.toUpperCase(),
          minQty,
          imgSrc
        }
      })
    });
  };

  clearState = () => {
    this.setState({
      category: "",
      details: {
        code: "",
        description: "",
        uom: "",
        minQty: "",
        imgSrc: []
      },
      bError: false,
      errorMsg: ""
    });
  };
  handleSubmit = async event => {
    event.preventDefault();
    const { category, bError } = this.state;
    const { code, description, uom, minQty, imgSrc } = this.state.details;

    if (isNaN(minQty)) {
      this.setState({
        bError: true,
        errorMsg: "Minimum Order Quantity must be a number."
      });
    } else if (
      // check if empty fields
      category.length &&
      code.length &&
      description.length &&
      uom.length &&
      minQty.length &&
      imgSrc.length
    ) {
      const response = await this.addProduct();
      if (response.ok) this.clearState();
    } else {
      if (!bError) {
        this.setState({
          bError: true,
          errorMsg: "All fields must be complete."
        });
      }
    }
  };

  render() {
    const { bError, errorMsg } = this.state;

    return (
      <Container text>
        {bError && (
          <Message negative>
            <Message.Header>Error in adding product:</Message.Header>
            <p>{errorMsg}</p>
          </Message>
        )}
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Category</label>
            <input
              placeholder="e.g. House Keeping"
              value={this.state.category}
              onChange={event => this.handleChange(event, "category")}
            />
          </Form.Field>
          <Form.Field>
            <label>Product Code</label>
            <input
              placeholder="e.g. C-001"
              value={this.state.details.code}
              onChange={event => this.handleChange(event, "code")}
            />
          </Form.Field>
          <Form.Field>
            <label>Product Description</label>
            <input
              placeholder="e.g. Ironing Board Cover"
              value={this.state.details.description}
              onChange={event => this.handleChange(event, "description")}
            />
          </Form.Field>
          <Form.Field>
            <label>Product Image Links (Separated by comma)</label>
            <input
              placeholder="e.g. https://imgur.com/a/MQ8sc36, https://i.imgur.com/9WtfjjI.jpg"
              value={this.state.details.imgSrc}
              onChange={event => this.handleChange(event, "imgSrc")}
            />
          </Form.Field>
          <Form.Field>
            <label>Unit of Measure</label>
            <input
              placeholder="e.g. PCS/CTN"
              value={this.state.details.uom}
              onChange={event => this.handleChange(event, "uom")}
            />
          </Form.Field>
          <Form.Field>
            <label>Minimum Order Quantity</label>
            <input
              placeholder="e.g. 50"
              value={this.state.details.minQty}
              onChange={event => this.handleChange(event, "minQty")}
            />
          </Form.Field>
          <Button type="submit">Add Product</Button>
        </Form>
      </Container>
    );
  }
}

export default AddProducts;
