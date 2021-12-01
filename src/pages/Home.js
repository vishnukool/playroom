import React, {Component} from 'react';
import {Card, Col, Divider, Input, notification, Row, Skeleton} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

const {Search} = Input;

const getApiUrl = (query, page) => `/search?query=${query}&page=${page}`

class Home extends Component {
  state = {
    isSearching: false,
    isLoadingMore: false,
    query: '',
    products: [],
    nextPage: 1,
  };

  constructor(props) {
    super(props);
    this.fetchProducts = this.fetchProducts.bind(this);
    this.loadMoreData = this.loadMoreData.bind(this);
  }

  async loadMoreData() {
    if (this.state.isLoadingMore) {
      return;
    }
    this.setState({isLoadingMore: true});

    //Todo: Need to move this to async await pattern like below.
    fetch(getApiUrl(this.state.query, this.state.nextPage))
      .then(res => res.json())
      .then(body => {
        this.setState({
          isLoadingMore: false,
          products: this.state.products.concat(body),
          nextPage: this.state.nextPage + 1
        });
      })
      .catch(() => {
        this.setState({isLoadingMore: false});
      });
  };

  async fetchProducts(value) {
    if (!value) {
      return;
    }
    this.setState({isSearching: true, query: value});
    try {
      const response = await fetch(getApiUrl(value, 0));
      const products = await response.json();
      this.setState({
        isSearching: false,
        products: products,
        nextPage: 1
      });
    } catch (error) {
      console.error(error);
      this.setState({isSearching: false});
      notification.error({
        message: 'Sorry, Something went wrong'
      });
    }
  }

  render() {
    return (
      <div>
        <Search
          placeholder="input search text"
          allowClear
          loading={this.state.isSearching}
          enterButton="Search"
          size="large"
          onSearch={this.fetchProducts}
        />
        <div style={{marginTop: '10px'}}>
          {this.state.products.length > 0 ?
            <div
              id="scrollableDiv"
              style={{
                height: '80vh',
                overflow: 'auto',
                padding: '0 16px',
                border: '1px solid rgba(140, 140, 140, 0.35)',
              }}
            >
              <InfiniteScroll
                dataLength={this.state.products.length}
                next={this.loadMoreData}
                hasMore={true}
                loader={<Skeleton avatar paragraph={{rows: 1}} active/>}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <Row>
                  {this.state.products.map((item) =>

                    <Col span={6}><a href={item.productUrl} target="_blank" style={{margin: '5px'}}>
                      <Card title={item.vendor} style={{height: 350}}
                            cover={<img alt={item.description} src={item.imageUrl}
                                        style={{height: '100px', objectFit: 'contain'}}/>} hoverable>
                        <p style={{fontWeight: 'bold'}}>${item.price}</p>
                        {item.hasStock ? <p>In Stock</p> : <p>Out of Stock</p>}
                        <p>{item.description.substring(0, 150)}</p>
                      </Card>
                    </a></Col>
                  )}
                </Row>

              </InfiniteScroll>
            </div>
            : null}
        </div>

      </div>
    );
  }
}

export default Home