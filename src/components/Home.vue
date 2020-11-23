<template>
    <div class="row no-gutters">
        <div class="col-lg-12">
            <div class="wrapper-banner">
                <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
                    <div class="col-md-10 mx-auto my-8">
                        <img src="assets/home-page-icon-02.png" class="home-icons"/>
                        <h1 class="display-4 font-weight-normal">Connect your arcade</h1>
                        <p class="lead font-weight-normal">Connect you cabinet to the network, rank against other dance game players online. </p>

                        <div class="btn btn-info m-1" onclick="window.open('https://github.com/electromuis/padmiss-client', '_blank');">
                            Install instructions
                        </div>

<!--                        <b-button @click="$router.push({path: `/register`})" variant="outline-secondary" class="m-1">-->
<!--                            More info-->
<!--                        </b-button>-->
                    </div>
                    <div class="product-device shadow-sm d-none d-md-block"></div>
                    <div class="product-device product-device-2 shadow-sm d-none d-md-block"></div>
                </div>
            </div>
        </div>
        <div class="col-lg-12">
            <div class="wrapper-banner">
                <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-dark">
                    <div class="col-md-10 mx-auto my-8">
                        <img src="assets/home-page-icon-01.png" class="home-icons"/>
                        <h1 class="display-4 font-weight-normal text-white">Track your score</h1>
                        <p class="lead font-weight-normal text-white">Keep track of your progress online and analyse proformance.</p>

                        <b-button @click="$router.push({path: `/login`})" variant="info" class="m-1">
                            Login
                        </b-button>

                        <b-button @click="$router.push({path: `/register`})" variant="outline-light" class="m-1">
                            Register
                        </b-button>
                    </div>
                    <div class="product-device shadow-sm d-none d-md-block"></div>
                    <div class="product-device product-device-2 shadow-sm d-none d-md-block"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>
    .table-pagination{
        max-width:100%;
        flex-wrap:wrap
    }
    .header-col:hover,.header-col:hover i{
        text-decoration:underline;color:#a9a9a9
    }
    .table-wrapper{
        max-width:100%;overflow-x:scroll
    }
    .wrapper-banner > div{
        margin: 0  !important;
        padding-top: 130px  !important;
        padding-bottom: 150px  !important;
    }
    .home-icons {
        max-height: 155px;
        max-width: 100%;
    }
</style>