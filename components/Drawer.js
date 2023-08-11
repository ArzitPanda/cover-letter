
'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from 'next/link';
import { ChatBubble, ChatBubbleOutline } from '@mui/icons-material';

export default function TemporaryDrawer({data,state,setState}) {



const lengthOfString = (str)=>{

if(str.length<=10)
{
    return str;
}
else
{
    return str.slice(0,10)+"..."
}

}


  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(!state);
  };

  const list = () => (
    <Box
      sx={{ width: 'auto'}}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {data?.map((ele, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ChatBubble/>
              </ListItemIcon>
              <Link href={`/chat/${ele.id}`}>
        
              <ListItemText primary={lengthOfString(ele.question || "hello"  )} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
   
    </Box>
  );

  return (
    <div>
    
        <React.Fragment>
        
          <Drawer
            anchor={'right'}
            open={state}
            onClose={toggleDrawer}
          >
            {list()}
          </Drawer>
        </React.Fragment>
    
    </div>
  );
}