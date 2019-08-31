import React from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Error404 from '@views/Exception/404';
import AsyncComponent from '../AsyncComponent';
import LayoutStore from '@store/layoutStore';

/**
 * 路由生成组件
 * 遍历路由表 生成多级路由
 */

interface InjectedProps {
  layoutStore: LayoutStore;
}

const RenderRoutes: React.FC = props => {
  const injected = () => {
    return props as InjectedProps;
  };

  const RouteMiddle = (props: any) => {
    const { path, exact, strict, render, location, ...rest } = props;
    return (
      <Route
        path={path}
        exact={exact}
        strict={strict}
        location={location}
        render={props => render({ ...props, ...rest })}
      />
    );
  };
  const generateRoute = (routes: any, switchProps?: any) => {
    return routes ? (
      <Switch {...switchProps}>
        {routes.map((route: any, i: number) => {
          const {
            redirect,
            path,
            exact,
            strict,
            routes,
            component,
            key
            // withAuthority,
            // authority,
            // name
          } = route;
          if (redirect) {
            return (
              <Redirect key={key || i} from={path} to={redirect} exact={exact} strict={strict} />
            );
          }
          return (
            <RouteMiddle
              key={i}
              path={path}
              exact={exact}
              strict={strict}
              render={(props: any) => {
                const childRoutes = generateRoute(routes, {
                  location: props.location
                });
                if (component) {
                  return (
                    <AsyncComponent componentInfo={component} route={route}>
                      {childRoutes}
                    </AsyncComponent>
                  );
                } else {
                  return childRoutes;
                }
              }}
            />
          );
        })}
        <Route component={Error404} />
      </Switch>
    ) : null;
  };

  const {
    layoutStore: { routeConfig }
  } = injected();
  return <Router>{generateRoute(routeConfig)}</Router>;
};

export default inject('layoutStore')(observer(RenderRoutes));
